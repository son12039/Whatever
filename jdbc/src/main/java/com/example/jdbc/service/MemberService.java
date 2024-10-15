package com.example.jdbc.service;

import com.example.jdbc.domain.Member;
import com.example.jdbc.repo.MemberRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MemberService {

    @Autowired
    private MemberRepo dao;

    public void signUp(Member vo) {
        dao.save(vo);
    }

    public Member login(String id, String password) {
        Member member = dao.findById(id).get();

        if(member!=null && password.equals(member.getPassword())){
            return member;
        }
        return null;

    }

}
