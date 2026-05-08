package com.grupocordillera.kpi.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/test/secure")
    public String secureEndpoint() {
        return "Acceso autorizado con JWT";
    }
}