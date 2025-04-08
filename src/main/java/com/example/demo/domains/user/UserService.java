package com.example.demo.domains.user;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserMapper userMapper;

    public int userSignup(Map<String, Object> params) {
        return  userMapper.insertUser(params);
    }
}
