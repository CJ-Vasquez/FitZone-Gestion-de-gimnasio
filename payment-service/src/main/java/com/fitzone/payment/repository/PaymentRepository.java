package com.fitzone.payment.repository;

import com.fitzone.payment.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByMiembroId(Long miembroId);
    List<Payment> findByMiembroIdOrderByFechaPagoDesc(Long miembroId);
    List<Payment> findByEstado(Payment.EstadoPago estado);
}
