package com.example.jdbc.repo;

import com.example.jdbc.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepo extends JpaRepository<Member,String> {
}
