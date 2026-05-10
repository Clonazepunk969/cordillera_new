package com.grupocordillera.kpi.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());
        return ResponseEntity.badRequest().body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> error = new HashMap<>();

        List<FieldError> fieldErrors = ex.getBindingResult().getFieldErrors();

        if (!fieldErrors.isEmpty()) {
            error.put("error", fieldErrors.get(0).getDefaultMessage());
        } else {
            error.put("error", "Error de validación");
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
}