package com.fitzone.member.repository;

import com.fitzone.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByEmail(String email);
    Optional<Member> findByDni(String dni);
    List<Member> findByEstado(Member.Estado estado);
    boolean existsByEmail(String email);
    boolean existsByDni(String dni);
}
