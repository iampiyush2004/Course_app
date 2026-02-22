package com.UPSKILL.Server.controllers;

import com.UPSKILL.Server.entities.User;
import com.UPSKILL.Server.services.ProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/progress")
@RequiredArgsConstructor
public class ProgressController {

    private final ProgressService progressService;

    @PutMapping("/update/{courseId}")
    public ResponseEntity<?> updateProgress(@AuthenticationPrincipal User user,
            @PathVariable String courseId,
            @RequestBody Map<String, Object> body) {
        Integer videoId = (Integer) body.get("videoId");
        Double timeStamp = Double.valueOf(body.get("timeStamp").toString());
        return ResponseEntity.ok(progressService.updateProgress(user.getId(), courseId, videoId, timeStamp));
    }

    @GetMapping("/getProgress/{courseId}")
    public ResponseEntity<?> getProgress(@AuthenticationPrincipal User user, @PathVariable String courseId) {
        return ResponseEntity.ok(progressService.getProgress(user.getId(), courseId).orElse(null));
    }
}
