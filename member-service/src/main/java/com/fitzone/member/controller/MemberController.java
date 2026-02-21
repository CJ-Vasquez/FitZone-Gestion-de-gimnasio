package com.fitzone.member.controller;

import com.fitzone.member.dto.MemberDTOs.*;
import com.fitzone.member.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/miembros")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @GetMapping
    public ResponseEntity<List<MiembroRespuesta>> getAllMembers() {
        return ResponseEntity.ok(memberService.getAllMembers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MiembroRespuesta> getMemberById(@PathVariable Long id) {
        return ResponseEntity.ok(memberService.getMemberById(id));
    }

    @PostMapping
    public ResponseEntity<MiembroRespuesta> createMember(@Valid @RequestBody CrearMiembroRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(memberService.createMember(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MiembroRespuesta> updateMember(@PathVariable Long id,
                                                        @Valid @RequestBody ActualizarMiembroRequest request) {
        return ResponseEntity.ok(memberService.updateMember(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMember(@PathVariable Long id) {
        memberService.deleteMember(id);
        return ResponseEntity.noContent().build();
    }
}
