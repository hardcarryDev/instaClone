package com.example.demo.domains.api;

import com.example.demo.common.data.ResultData;
import com.example.demo.common.enums.ApiResultEnum;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class ApiController {

    @GetMapping(value = "/test1")
    public Map<String, Object> test1(){
        Map<String, Object> map = new HashMap<>();
        map.put("param1", "param1");
        map.put("param2", "param2");
        map.put("param3", "param3");
        map.put("param4", "param4");
        return map;
    }

    @GetMapping(value = "/test2")
    public ResponseEntity<ResultData> test2(){
        Map<String, Object> map = new HashMap<>();
        map.put("param1", "param1");
        map.put("param2", "param2");
        map.put("param3", "param3");
        map.put("param4", "param4");
        return ResponseEntity.ok(new ResultData(ApiResultEnum.SUCCESS, map));
    }

    @GetMapping(value = "/test3")
    public ResponseEntity<ResultData> test3(){
        Map<String, Object> map = new HashMap<>();
        throw new RuntimeException();
    }
}
