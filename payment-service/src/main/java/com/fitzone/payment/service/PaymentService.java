package com.fitzone.payment.service;

import com.fitzone.payment.config.RabbitMQConfig;
import com.fitzone.payment.dto.PaymentDTOs.*;
import com.fitzone.payment.entity.Payment;
import com.fitzone.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final RabbitTemplate rabbitTemplate;

    public List<PagoRespuesta> obtenerTodosLosPagos() {
        return paymentRepository.findAll().stream().map(this::mapearARespuesta).collect(Collectors.toList());
    }

    public List<PagoRespuesta> obtenerPagosPorMiembro(Long miembroId) {
        return paymentRepository.findByMiembroIdOrderByFechaPagoDesc(miembroId).stream()
                .map(this::mapearARespuesta).collect(Collectors.toList());
    }

    public PagoRespuesta obtenerPagoPorId(Long id) {
        Payment pago = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado con id: " + id));
        return mapearARespuesta(pago);
    }

    public PagoRespuesta crearPago(CrearPagoRequest request) {
        Payment pago = Payment.builder()
                .miembroId(request.getMiembroId())
                .planId(request.getPlanId())
                .monto(request.getMonto())
                .metodoPago(request.getMetodoPago())
                .estado(Payment.EstadoPago.CONFIRMADO)
                .notas(request.getNotas())
                .build();

        Payment guardado = paymentRepository.save(pago);

        // Publicar evento en RabbitMQ para activar la membresía
        EventoPago evento = EventoPago.builder()
                .miembroId(guardado.getMiembroId())
                .planId(guardado.getPlanId())
                .tipoEvento("PAGO_CONFIRMADO")
                .build();

        log.info("Publicando evento de pago: {}", evento);
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.PAYMENT_EXCHANGE,
                RabbitMQConfig.PAYMENT_ROUTING_KEY,
                evento
        );

        return mapearARespuesta(guardado);
    }

    public PagoRespuesta actualizarPago(Long id, ActualizarPagoRequest request) {
        Payment pago = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado con id: " + id));

        if (request.getEstado() != null) {
            pago.setEstado(request.getEstado());
            // Si se confirma mediante actualización, también publicar evento
            if (request.getEstado() == Payment.EstadoPago.CONFIRMADO) {
                EventoPago evento = EventoPago.builder()
                        .miembroId(pago.getMiembroId())
                        .planId(pago.getPlanId())
                        .tipoEvento("PAGO_CONFIRMADO")
                        .build();
                rabbitTemplate.convertAndSend(
                        RabbitMQConfig.PAYMENT_EXCHANGE,
                        RabbitMQConfig.PAYMENT_ROUTING_KEY,
                        evento
                );
            }
        }
        if (request.getMetodoPago() != null) pago.setMetodoPago(request.getMetodoPago());
        if (request.getNotas() != null) pago.setNotas(request.getNotas());

        return mapearARespuesta(paymentRepository.save(pago));
    }

    public void eliminarPago(Long id) {
        if (!paymentRepository.existsById(id)) throw new RuntimeException("Pago no encontrado con id: " + id);
        paymentRepository.deleteById(id);
    }

    private PagoRespuesta mapearARespuesta(Payment p) {
        return PagoRespuesta.builder()
                .id(p.getId()).miembroId(p.getMiembroId()).planId(p.getPlanId())
                .monto(p.getMonto()).metodoPago(p.getMetodoPago().name())
                .estado(p.getEstado().name()).fechaPago(p.getFechaPago()).notas(p.getNotas())
                .build();
    }
}
