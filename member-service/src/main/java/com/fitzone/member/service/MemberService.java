package com.fitzone.member.service;

import com.fitzone.member.dto.MemberDTOs.*;
import com.fitzone.member.entity.Member;
import com.fitzone.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MemberService {

    private final MemberRepository memberRepository;

    public List<MiembroRespuesta> getAllMembers() {
        return memberRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public MiembroRespuesta getMemberById(Long id) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Miembro no encontrado con id: " + id));
        return mapToResponse(member);
    }

    public MiembroRespuesta createMember(CrearMiembroRequest request) {
        if (memberRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email ya registrado");
        }
        if (memberRepository.existsByDni(request.getDni())) {
            throw new RuntimeException("DNI ya registrado");
        }

        Member member = Member.builder()
                .nombre(request.getNombre())
                .apellido(request.getApellido())
                .email(request.getEmail())
                .telefono(request.getTelefono())
                .dni(request.getDni())
                .planId(request.getPlanId())
                .estado(Member.Estado.PENDIENTE)
                .build();

        return mapToResponse(memberRepository.save(member));
    }

    public MiembroRespuesta updateMember(Long id, ActualizarMiembroRequest request) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Miembro no encontrado con id: " + id));

        if (request.getNombre() != null) member.setNombre(request.getNombre());
        if (request.getApellido() != null) member.setApellido(request.getApellido());
        if (request.getEmail() != null) member.setEmail(request.getEmail());
        if (request.getTelefono() != null) member.setTelefono(request.getTelefono());
        if (request.getEstado() != null) member.setEstado(request.getEstado());
        if (request.getPlanId() != null) member.setPlanId(request.getPlanId());

        return mapToResponse(memberRepository.save(member));
    }

    public void deleteMember(Long id) {
        if (!memberRepository.existsById(id)) {
            throw new RuntimeException("Miembro no encontrado con id: " + id);
        }
        memberRepository.deleteById(id);
    }

    public void activateMembershipFromPayment(EventoPago event) {
        log.info("Activando membresía para miembro {} con plan {}", event.getMiembroId(), event.getPlanId());
        memberRepository.findById(event.getMiembroId()).ifPresent(member -> {
            member.setEstado(Member.Estado.ACTIVO);
            member.setPlanId(event.getPlanId());
            memberRepository.save(member);
            log.info("Miembro {} activado exitosamente", event.getMiembroId());
        });
    }

    private MiembroRespuesta mapToResponse(Member member) {
        return MiembroRespuesta.builder()
                .id(member.getId())
                .nombre(member.getNombre())
                .apellido(member.getApellido())
                .email(member.getEmail())
                .telefono(member.getTelefono())
                .dni(member.getDni())
                .estado(member.getEstado().name())
                .planId(member.getPlanId())
                .fechaRegistro(member.getFechaRegistro())
                .fechaActualizacion(member.getFechaActualizacion())
                .build();
    }
}
