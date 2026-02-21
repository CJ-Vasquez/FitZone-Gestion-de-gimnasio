package com.fitzone.payment.controller;

import com.fitzone.payment.dto.PaymentDTOs.*;
import com.fitzone.payment.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pagos")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping
    public ResponseEntity<List<PagoRespuesta>> obtenerTodosLosPagos() {
        return ResponseEntity.ok(paymentService.obtenerTodosLosPagos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PagoRespuesta> obtenerPagoPorId(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.obtenerPagoPorId(id));
    }

    @GetMapping("/miembro/{miembroId}")
    public ResponseEntity<List<PagoRespuesta>> obtenerPagosPorMiembro(@PathVariable Long miembroId) {
        return ResponseEntity.ok(paymentService.obtenerPagosPorMiembro(miembroId));
    }

    @PostMapping
    public ResponseEntity<PagoRespuesta> crearPago(@Valid @RequestBody CrearPagoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(paymentService.crearPago(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PagoRespuesta> actualizarPago(@PathVariable Long id,
                                                         @Valid @RequestBody ActualizarPagoRequest request) {
        return ResponseEntity.ok(paymentService.actualizarPago(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPago(@PathVariable Long id) {
        paymentService.eliminarPago(id);
        return ResponseEntity.noContent().build();
    }
}
