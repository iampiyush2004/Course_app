package com.UPSKILL.Server.config;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<?> handleRuntimeException(RuntimeException e) {
        return ResponseEntity.status(400).body(Map.of("message", e.getMessage()));
    }

    @ExceptionHandler(java.io.IOException.class)
    public ResponseEntity<?> handleIOException(java.io.IOException e) {
        return ResponseEntity.status(500).body(Map.of("message", "File operation failed: " + e.getMessage()));
    }

    @ExceptionHandler(com.razorpay.RazorpayException.class)
    public ResponseEntity<?> handleRazorpayException(com.razorpay.RazorpayException e) {
        return ResponseEntity.status(400).body(Map.of("message", "Payment Error: " + e.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGeneralException(Exception e) {
        return ResponseEntity.status(500).body(Map.of("message", "Internal Server Error: " + e.getMessage()));
    }
}
