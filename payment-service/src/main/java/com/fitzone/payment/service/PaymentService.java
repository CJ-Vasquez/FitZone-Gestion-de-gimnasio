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

    public List<PaymentResponse> getAllPayments() {
        return paymentRepository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<PaymentResponse> getPaymentsByMember(Long memberId) {
        return paymentRepository.findByMemberIdOrderByPaymentDateDesc(memberId).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    public PaymentResponse getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + id));
        return mapToResponse(payment);
    }

    public PaymentResponse createPayment(CreatePaymentRequest request) {
        Payment payment = Payment.builder()
                .memberId(request.getMemberId())
                .planId(request.getPlanId())
                .amount(request.getAmount())
                .paymentMethod(request.getPaymentMethod())
                .status(Payment.PaymentStatus.CONFIRMED)
                .notes(request.getNotes())
                .build();

        Payment saved = paymentRepository.save(payment);

        // Publish event to RabbitMQ to activate membership
        PaymentEvent event = PaymentEvent.builder()
                .memberId(saved.getMemberId())
                .planId(saved.getPlanId())
                .eventType("PAYMENT_CONFIRMED")
                .build();

        log.info("Publishing payment event: {}", event);
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.PAYMENT_EXCHANGE,
                RabbitMQConfig.PAYMENT_ROUTING_KEY,
                event
        );

        return mapToResponse(saved);
    }

    public PaymentResponse updatePayment(Long id, UpdatePaymentRequest request) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + id));

        if (request.getStatus() != null) {
            payment.setStatus(request.getStatus());
            // If confirmed via update, also publish event
            if (request.getStatus() == Payment.PaymentStatus.CONFIRMED) {
                PaymentEvent event = PaymentEvent.builder()
                        .memberId(payment.getMemberId())
                        .planId(payment.getPlanId())
                        .eventType("PAYMENT_CONFIRMED")
                        .build();
                rabbitTemplate.convertAndSend(
                        RabbitMQConfig.PAYMENT_EXCHANGE,
                        RabbitMQConfig.PAYMENT_ROUTING_KEY,
                        event
                );
            }
        }
        if (request.getPaymentMethod() != null) payment.setPaymentMethod(request.getPaymentMethod());
        if (request.getNotes() != null) payment.setNotes(request.getNotes());

        return mapToResponse(paymentRepository.save(payment));
    }

    public void deletePayment(Long id) {
        if (!paymentRepository.existsById(id)) throw new RuntimeException("Payment not found with id: " + id);
        paymentRepository.deleteById(id);
    }

    private PaymentResponse mapToResponse(Payment p) {
        return PaymentResponse.builder()
                .id(p.getId()).memberId(p.getMemberId()).planId(p.getPlanId())
                .amount(p.getAmount()).paymentMethod(p.getPaymentMethod().name())
                .status(p.getStatus().name()).paymentDate(p.getPaymentDate()).notes(p.getNotes())
                .build();
    }
}
