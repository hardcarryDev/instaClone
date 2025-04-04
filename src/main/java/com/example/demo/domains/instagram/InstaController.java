package com.example.demo.domains.instagram;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping(value = "insta")
public class InstaController {

    @GetMapping("/login")
    public String loginPage1() {
        return "login";
    }


    @GetMapping("/test")
    public String testPage1() {
        return "test";
    }
}
