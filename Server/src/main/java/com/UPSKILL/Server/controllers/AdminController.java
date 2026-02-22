package com.UPSKILL.Server.controllers;

import com.UPSKILL.Server.dto.*;
import com.UPSKILL.Server.entities.Admin;
import com.UPSKILL.Server.entities.Course;
import com.UPSKILL.Server.entities.Video;
import com.UPSKILL.Server.services.AdminService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final com.UPSKILL.Server.services.CourseService courseService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody AdminSignupRequest request) {
        adminService.signup(request);
        return ResponseEntity.ok(Map.of("message", "Signup Successful"));
    }

    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signin(@RequestBody SigninRequest request, HttpServletResponse response) {
        AuthResponse authResponse = adminService.signin(request, response);
        response.setHeader("Authorization", "Bearer " + authResponse.getToken());
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        adminService.logout(response);
        return ResponseEntity.ok(Map.of("message", "Admin Logged Out successfully!!!"));
    }

    @GetMapping("/teacherInfo")
    public ResponseEntity<?> teacherInfo(@AuthenticationPrincipal Object principal) {
        if (!(principal instanceof Admin admin)) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(adminService.teacherInfo(admin.getId()));
    }

    @PutMapping("/editProfile")
    public ResponseEntity<?> editProfile(@AuthenticationPrincipal Admin admin,
            @RequestBody EditAdminProfileRequest request) {
        return ResponseEntity.ok(adminService.editProfile(admin.getId(), request));
    }

    @PostMapping("/upload-image")
    public ResponseEntity<?> updateAvatar(@AuthenticationPrincipal Admin admin,
            @RequestParam("file") MultipartFile file) throws IOException {
        String url = adminService.updateAvatar(admin.getId(), file);
        return ResponseEntity.ok(Map.of("imageUrl", url));
    }

    @PostMapping("/createCourse")
    public ResponseEntity<?> createCourse(@AuthenticationPrincipal Admin admin,
            @ModelAttribute CreateCourseRequest request,
            @RequestParam("file") MultipartFile file) throws IOException {
        String courseId = adminService.createCourse(admin.getId(), request, file);
        return ResponseEntity.ok(Map.of("message", "Course created successfully", "courseId", courseId));
    }

    @GetMapping("/isLoggedin")
    public ResponseEntity<?> isLoggedin(@AuthenticationPrincipal Object principal) {
        if (principal instanceof Admin admin) {
            return ResponseEntity.ok(Map.of(
                    "message", "Admin is Logged In",
                    "isLoggedin", true,
                    "admin", adminService.teacherInfo(admin.getId())));
        }
        return ResponseEntity.ok(Map.of(
                "message", "Admin is not Logged In",
                "isLoggedin", false));
    }

    @GetMapping("/courses")
    public ResponseEntity<List<Course>> adminSpecificCourses(@AuthenticationPrincipal Admin admin) {
        return ResponseEntity.ok(adminService.adminSpecificCourses(admin.getId()));
    }

    @PostMapping("/uploadVideo/{courseId}")
    public ResponseEntity<Video> uploadVideo(@AuthenticationPrincipal Admin admin,
            @PathVariable String courseId,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("duration") Double duration,
            @RequestPart("videoFile") MultipartFile videoFile,
            @RequestPart("thumbnail") MultipartFile thumbnailFile) throws IOException {

        return ResponseEntity.ok(adminService.uploadVideo(admin.getId(), courseId, title, description, duration,
                videoFile, thumbnailFile));
    }

    @DeleteMapping("/deleteCourse/{courseId}")
    public ResponseEntity<?> deleteCourse(@AuthenticationPrincipal Admin admin, @PathVariable String courseId) {
        courseService.deleteCourse(admin.getId(), courseId);
        return ResponseEntity.ok(Map.of("message", "Course deleted successfully"));
    }

    @DeleteMapping("/courses/{courseId}/videos/{videoId}")
    public ResponseEntity<?> deleteVideo(@AuthenticationPrincipal Admin admin, @PathVariable String courseId,
            @PathVariable String videoId) throws IOException {
        adminService.deleteVideo(admin.getId(), courseId, videoId);
        return ResponseEntity.ok(Map.of("message", "Video deleted successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> teacherPage(@PathVariable String id) {
        return ResponseEntity.ok(adminService.teacherPage(id));
    }
}
