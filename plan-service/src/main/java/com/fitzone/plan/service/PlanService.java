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

    public List<PlanResponse> getAllPlans() {
        return planRepository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<PlanResponse> getActivePlans() {
        return planRepository.findByActiveTrue().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public PlanResponse getPlanById(Long id) {
        Plan plan = planRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan not found with id: " + id));
        return mapToResponse(plan);
    }

    public PlanResponse createPlan(CreatePlanRequest request) {
        Plan plan = Plan.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .durationDays(request.getDurationDays())
                .active(request.getActive())
                .build();
        return mapToResponse(planRepository.save(plan));
    }

    public PlanResponse updatePlan(Long id, UpdatePlanRequest request) {
        Plan plan = planRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan not found with id: " + id));

        if (request.getName() != null) plan.setName(request.getName());
        if (request.getDescription() != null) plan.setDescription(request.getDescription());
        if (request.getPrice() != null) plan.setPrice(request.getPrice());
        if (request.getDurationDays() != null) plan.setDurationDays(request.getDurationDays());
        if (request.getActive() != null) plan.setActive(request.getActive());

        return mapToResponse(planRepository.save(plan));
    }

    public void deletePlan(Long id) {
        if (!planRepository.existsById(id)) throw new RuntimeException("Plan not found with id: " + id);
        planRepository.deleteById(id);
    }

    private PlanResponse mapToResponse(Plan plan) {
        return PlanResponse.builder()
                .id(plan.getId()).name(plan.getName()).description(plan.getDescription())
                .price(plan.getPrice()).durationDays(plan.getDurationDays())
                .active(plan.getActive()).createdAt(plan.getCreatedAt()).updatedAt(plan.getUpdatedAt())
                .build();
    }
}
