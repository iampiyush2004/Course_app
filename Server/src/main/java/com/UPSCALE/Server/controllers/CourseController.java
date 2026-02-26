package com.UPSCALE.Server.controllers;

import com.UPSCALE.Server.services.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @GetMapping({ "", "/" })
    public ResponseEntity<?> viewAllCourses() {
        return ResponseEntity.ok(Map.of("courses", courseService.viewAllCourses()));
    }

    @GetMapping("/{courseId}")
    public ResponseEntity<?> viewCourse(@PathVariable String courseId) {
        return ResponseEntity.ok(courseService.viewCourse(courseId));
    }

    @GetMapping("/videos/{courseId}")
    public ResponseEntity<?> viewVids(@PathVariable String courseId) {
        return ResponseEntity.ok(courseService.viewVids(courseId));
    }
}
