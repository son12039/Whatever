package com.example.jdbc.controller;

import com.example.jdbc.domain.Member;
import com.example.jdbc.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/member/*")
@CrossOrigin(origins = {"*"}, maxAge = 6000)
public class MemberController {

    @Autowired
    private MemberService service;

    @PostMapping("/signup")
    public ResponseEntity signup(@RequestBody Member vo){
        service.signUp(vo);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody Member vo) {
        Member member = service.login(vo.getId(),vo.getPassword());
        return ResponseEntity.status(HttpStatus.OK).body(member);
    }
}
