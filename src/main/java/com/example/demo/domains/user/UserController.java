package com.example.demo.domains.user;

import com.example.demo.common.data.ResultData;
import com.example.demo.common.enums.ApiResultEnum;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.HashMap;
import java.util.Map;

@Controller
@RequiredArgsConstructor
@RequestMapping(value = "/user")
public class UserController {

    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<ResultData> userSignup(@RequestBody Map<String, Object> param) {
        int result = userService.userSignup(param);
        return ResponseEntity.ok(new ResultData(ApiResultEnum.SUCCESS));
    }
}
