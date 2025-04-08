package com.example.demo.domains.user;

import com.example.demo.common.data.ResultData;
import com.example.demo.common.enums.ApiResultEnum;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

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

/** 스프링 시큐리티에서 intercept 함. 구현하지 않아도됌 */
//    @PostMapping("/login")
//    public ResponseEntity<ResultData> userLogin(@RequestBody Map<String, Object> param) {
//        return null;
//    }
}
