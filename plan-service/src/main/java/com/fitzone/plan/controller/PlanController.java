package com.fitzone.plan.controller;

import com.fitzone.plan.dto.PlanDTOs.*;
import com.fitzone.plan.service.PlanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/planes")
@RequiredArgsConstructor
public class PlanController {

    private final PlanService planService;

    @GetMapping
    public ResponseEntity<List<PlanRespuesta>> obtenerTodosLosPlanes(@RequestParam(required = false) Boolean soloActivos) {
        if (Boolean.TRUE.equals(soloActivos)) return ResponseEntity.ok(planService.obtenerPlanesActivos());
        return ResponseEntity.ok(planService.obtenerTodosLosPlanes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlanRespuesta> obtenerPlanPorId(@PathVariable Long id) {
        return ResponseEntity.ok(planService.obtenerPlanPorId(id));
    }

    @PostMapping
    public ResponseEntity<PlanRespuesta> crearPlan(@Valid @RequestBody CrearPlanRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(planService.crearPlan(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlanRespuesta> actualizarPlan(@PathVariable Long id,
                                                    @Valid @RequestBody ActualizarPlanRequest request) {
        return ResponseEntity.ok(planService.actualizarPlan(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPlan(@PathVariable Long id) {
        planService.eliminarPlan(id);
        return ResponseEntity.noContent().build();
    }
}
