package com.example.demo.domains.user;

import com.example.demo.common.data.ResultData;
import com.example.demo.common.enums.ApiResultEnum;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping(value = "/user")
public class UserController {

    @PostMapping("/signup")
    public ResponseEntity<ResultData> signup() {
        Map<String, Object> map = new HashMap<>();
        map.put("param1", "param1");
        map.put("param2", "param2");
        map.put("param3", "param3");
        map.put("param4", "param4");
        return ResponseEntity.ok(new ResultData(ApiResultEnum.SUCCESS, map));
    }
}
