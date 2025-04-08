package com.example.demo.domains.user;

import com.example.demo.annotation.CommonMapper;

import java.util.Map;

@CommonMapper
public interface UserMapper {

    // 회원가입: 회원 정보 저장
    int insertUser(Map<String, Object> param);

    // 사용자 ID로 중복 확인
    //    Map<String, Object> findByUserId(String userId);
}
