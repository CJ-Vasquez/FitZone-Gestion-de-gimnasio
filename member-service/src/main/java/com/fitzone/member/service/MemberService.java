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

    public List<MemberResponse> getAllMembers() {
        return memberRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public MemberResponse getMemberById(Long id) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Member not found with id: " + id));
        return mapToResponse(member);
    }

    public MemberResponse createMember(CreateMemberRequest request) {
        if (memberRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        if (memberRepository.existsByDni(request.getDni())) {
            throw new RuntimeException("DNI already registered");
        }

        Member member = Member.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .dni(request.getDni())
                .planId(request.getPlanId())
                .status(Member.Status.PENDING)
                .build();

        return mapToResponse(memberRepository.save(member));
    }

    public MemberResponse updateMember(Long id, UpdateMemberRequest request) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Member not found with id: " + id));

        if (request.getFirstName() != null) member.setFirstName(request.getFirstName());
        if (request.getLastName() != null) member.setLastName(request.getLastName());
        if (request.getEmail() != null) member.setEmail(request.getEmail());
        if (request.getPhone() != null) member.setPhone(request.getPhone());
        if (request.getStatus() != null) member.setStatus(request.getStatus());
        if (request.getPlanId() != null) member.setPlanId(request.getPlanId());

        return mapToResponse(memberRepository.save(member));
    }

    public void deleteMember(Long id) {
        if (!memberRepository.existsById(id)) {
            throw new RuntimeException("Member not found with id: " + id);
        }
        memberRepository.deleteById(id);
    }

    public void activateMembershipFromPayment(PaymentEvent event) {
        log.info("Activating membership for member {} with plan {}", event.getMemberId(), event.getPlanId());
        memberRepository.findById(event.getMemberId()).ifPresent(member -> {
            member.setStatus(Member.Status.ACTIVE);
            member.setPlanId(event.getPlanId());
            memberRepository.save(member);
            log.info("Member {} activated successfully", event.getMemberId());
        });
    }

    private MemberResponse mapToResponse(Member member) {
        return MemberResponse.builder()
                .id(member.getId())
                .firstName(member.getFirstName())
                .lastName(member.getLastName())
                .email(member.getEmail())
                .phone(member.getPhone())
                .dni(member.getDni())
                .status(member.getStatus().name())
                .planId(member.getPlanId())
                .registeredAt(member.getRegisteredAt())
                .updatedAt(member.getUpdatedAt())
                .build();
    }
}
