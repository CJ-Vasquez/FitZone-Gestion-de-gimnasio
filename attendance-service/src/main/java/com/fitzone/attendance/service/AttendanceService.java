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

    public List<AsistenciaRespuesta> getAllAttendance() {
        return attendanceRepository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<AsistenciaRespuesta> getAttendanceByMember(Long miembroId) {
        return attendanceRepository.findByMiembroIdOrderByEntradaDesc(miembroId).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    public AsistenciaRespuesta getAttendanceById(Long id) {
        Attendance a = attendanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registro de asistencia no encontrado con id: " + id));
        return mapToResponse(a);
    }

    public AsistenciaRespuesta checkIn(RegistroEntradaRequest request) {
        Attendance attendance = Attendance.builder()
                .miembroId(request.getMiembroId())
                .entrada(LocalDateTime.now())
                .observacion(request.getObservacion())
                .build();
        return mapToResponse(attendanceRepository.save(attendance));
    }

    public AsistenciaRespuesta updateAttendance(Long id, ActualizarAsistenciaRequest request) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registro de asistencia no encontrado con id: " + id));

        if (request.getEntrada() != null) attendance.setEntrada(request.getEntrada());
        if (request.getSalida() != null) attendance.setSalida(request.getSalida());
        if (request.getObservacion() != null) attendance.setObservacion(request.getObservacion());

        return mapToResponse(attendanceRepository.save(attendance));
    }

    public void deleteAttendance(Long id) {
        if (!attendanceRepository.existsById(id)) throw new RuntimeException("Registro de asistencia no encontrado con id: " + id);
        attendanceRepository.deleteById(id);
    }

    private AsistenciaRespuesta mapToResponse(Attendance a) {
        Long minutes = null;
        if (a.getEntrada() != null && a.getSalida() != null) {
            minutes = Duration.between(a.getEntrada(), a.getSalida()).toMinutes();
        }
        return AsistenciaRespuesta.builder()
                .id(a.getId()).miembroId(a.getMiembroId())
                .entrada(a.getEntrada()).salida(a.getSalida())
                .observacion(a.getObservacion()).minutosEnLocal(minutes)
                .build();
    }
}
