package com.fitzone.attendance.controller;

import com.fitzone.attendance.dto.AttendanceDTOs.*;
import com.fitzone.attendance.service.AttendanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/asistencia")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @GetMapping
    public ResponseEntity<List<AsistenciaRespuesta>> getAllAttendance() {
        return ResponseEntity.ok(attendanceService.getAllAttendance());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AsistenciaRespuesta> getById(@PathVariable Long id) {
        return ResponseEntity.ok(attendanceService.getAttendanceById(id));
    }

    @GetMapping("/miembro/{miembroId}")
    public ResponseEntity<List<AsistenciaRespuesta>> getByMember(@PathVariable Long miembroId) {
        return ResponseEntity.ok(attendanceService.getAttendanceByMember(miembroId));
    }

    @PostMapping("/entrada")
    public ResponseEntity<AsistenciaRespuesta> checkIn(@Valid @RequestBody RegistroEntradaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(attendanceService.checkIn(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AsistenciaRespuesta> updateAttendance(@PathVariable Long id,
                                                                @Valid @RequestBody ActualizarAsistenciaRequest request) {
        return ResponseEntity.ok(attendanceService.updateAttendance(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAttendance(@PathVariable Long id) {
        attendanceService.deleteAttendance(id);
        return ResponseEntity.noContent().build();
    }
}
