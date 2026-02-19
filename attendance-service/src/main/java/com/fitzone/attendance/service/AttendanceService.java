package com.fitzone.attendance.service;

import com.fitzone.attendance.dto.AttendanceDTOs.*;
import com.fitzone.attendance.entity.Attendance;
import com.fitzone.attendance.repository.AttendanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;

    public List<AttendanceResponse> getAllAttendance() {
        return attendanceRepository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<AttendanceResponse> getAttendanceByMember(Long memberId) {
        return attendanceRepository.findByMemberIdOrderByCheckInDesc(memberId).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    public AttendanceResponse getAttendanceById(Long id) {
        Attendance a = attendanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attendance record not found with id: " + id));
        return mapToResponse(a);
    }

    public AttendanceResponse checkIn(CheckInRequest request) {
        Attendance attendance = Attendance.builder()
                .memberId(request.getMemberId())
                .checkIn(LocalDateTime.now())
                .observation(request.getObservation())
                .build();
        return mapToResponse(attendanceRepository.save(attendance));
    }

    public AttendanceResponse updateAttendance(Long id, UpdateAttendanceRequest request) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attendance record not found with id: " + id));

        if (request.getCheckIn() != null) attendance.setCheckIn(request.getCheckIn());
        if (request.getCheckOut() != null) attendance.setCheckOut(request.getCheckOut());
        if (request.getObservation() != null) attendance.setObservation(request.getObservation());

        return mapToResponse(attendanceRepository.save(attendance));
    }

    public void deleteAttendance(Long id) {
        if (!attendanceRepository.existsById(id)) throw new RuntimeException("Attendance record not found: " + id);
        attendanceRepository.deleteById(id);
    }

    private AttendanceResponse mapToResponse(Attendance a) {
        Long minutes = null;
        if (a.getCheckIn() != null && a.getCheckOut() != null) {
            minutes = Duration.between(a.getCheckIn(), a.getCheckOut()).toMinutes();
        }
        return AttendanceResponse.builder()
                .id(a.getId()).memberId(a.getMemberId())
                .checkIn(a.getCheckIn()).checkOut(a.getCheckOut())
                .observation(a.getObservation()).minutesSpent(minutes)
                .build();
    }
}
