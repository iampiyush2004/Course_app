package com.UPSCALE.Server.controllers;

import com.UPSCALE.Server.entities.Progress;
import com.UPSCALE.Server.entities.User;
import com.UPSCALE.Server.services.ProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
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
        // If no progress exists yet (newly purchased course), return a default progress
        // so CoursePage.jsx doesn't crash on progress.timeStamp being null
        Progress progress = progressService.getProgress(user.getId(), courseId)
                .orElse(Progress.builder()
                        .userId(user.getId())
                        .courseId(courseId)
                        .videoId(0)
                        .timeStamp(0.0)
                        .build());

        Map<String, Object> response = new HashMap<>();
        response.put("progress", progress);
        return ResponseEntity.ok(response);
    }
}
