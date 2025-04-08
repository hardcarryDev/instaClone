package com.example.demo;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class TestApplication {
    public static void main(String[] args) {
        BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder(11);
        String encryptedPassword = bCryptPasswordEncoder.encode("test1");
        System.out.println(encryptedPassword);
    }
}
