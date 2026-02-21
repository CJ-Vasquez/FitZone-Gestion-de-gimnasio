package com.fitzone.plan.service;

import com.fitzone.plan.dto.PlanDTOs.*;
import com.fitzone.plan.entity.Plan;
import com.fitzone.plan.repository.PlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlanService {

    private final PlanRepository planRepository;

    public List<PlanRespuesta> obtenerTodosLosPlanes() {
        return planRepository.findAll().stream().map(this::mapearARespuesta).collect(Collectors.toList());
    }

    public List<PlanRespuesta> obtenerPlanesActivos() {
        return planRepository.findByActivoTrue().stream().map(this::mapearARespuesta).collect(Collectors.toList());
    }

    public PlanRespuesta obtenerPlanPorId(Long id) {
        Plan plan = planRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan no encontrado con id: " + id));
        return mapearARespuesta(plan);
    }

    public PlanRespuesta crearPlan(CrearPlanRequest request) {
        Plan plan = Plan.builder()
                .nombre(request.getNombre())
                .descripcion(request.getDescripcion())
                .precio(request.getPrecio())
                .duracionDias(request.getDuracionDias())
                .activo(request.getActivo())
                .build();
        return mapearARespuesta(planRepository.save(plan));
    }

    public PlanRespuesta actualizarPlan(Long id, ActualizarPlanRequest request) {
        Plan plan = planRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan no encontrado con id: " + id));

        if (request.getNombre() != null) plan.setNombre(request.getNombre());
        if (request.getDescripcion() != null) plan.setDescripcion(request.getDescripcion());
        if (request.getPrecio() != null) plan.setPrecio(request.getPrecio());
        if (request.getDuracionDias() != null) plan.setDuracionDias(request.getDuracionDias());
        if (request.getActivo() != null) plan.setActivo(request.getActivo());

        return mapearARespuesta(planRepository.save(plan));
    }

    public void eliminarPlan(Long id) {
        if (!planRepository.existsById(id)) throw new RuntimeException("Plan no encontrado con id: " + id);
        planRepository.deleteById(id);
    }

    private PlanRespuesta mapearARespuesta(Plan plan) {
        return PlanRespuesta.builder()
                .id(plan.getId()).nombre(plan.getNombre()).descripcion(plan.getDescripcion())
                .precio(plan.getPrecio()).duracionDias(plan.getDuracionDias())
                .activo(plan.getActivo()).fechaCreacion(plan.getFechaCreacion()).fechaActualizacion(plan.getFechaActualizacion())
                .build();
    }
}
