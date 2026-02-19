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
@RequestMapping("/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @GetMapping
    public ResponseEntity<List<AttendanceResponse>> getAllAttendance() {
        return ResponseEntity.ok(attendanceService.getAllAttendance());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AttendanceResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(attendanceService.getAttendanceById(id));
    }

    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<AttendanceResponse>> getByMember(@PathVariable Long memberId) {
        return ResponseEntity.ok(attendanceService.getAttendanceByMember(memberId));
    }

    @PostMapping("/checkin")
    public ResponseEntity<AttendanceResponse> checkIn(@Valid @RequestBody CheckInRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(attendanceService.checkIn(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AttendanceResponse> updateAttendance(@PathVariable Long id,
                                                                @Valid @RequestBody UpdateAttendanceRequest request) {
        return ResponseEntity.ok(attendanceService.updateAttendance(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAttendance(@PathVariable Long id) {
        attendanceService.deleteAttendance(id);
        return ResponseEntity.noContent().build();
    }
}
