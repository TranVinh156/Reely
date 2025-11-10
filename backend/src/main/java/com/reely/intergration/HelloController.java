package com.reely.intergration;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {
    @GetMapping("/hello")
    public ResponseEntity<String> getHello() {
        return ResponseEntity.ok().body("Hello");
    }

    @GetMapping("/hello2")
    public String hello2() {
        return "Hello2";
    }
}