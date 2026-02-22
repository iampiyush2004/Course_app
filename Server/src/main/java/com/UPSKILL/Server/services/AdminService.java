package com.UPSKILL.Server.services;

import com.UPSKILL.Server.dto.*;
import com.UPSKILL.Server.entities.*;
import com.UPSKILL.Server.repositories.*;
import com.UPSKILL.Server.utils.*;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository adminRepository;
    private final CourseRepository courseRepository;
    private final VideoRepository videoRepository;
    private final JwtUtil jwtUtil;
    private final CookieUtils cookieUtils;
    private final CloudinaryService cloudinaryService;
    private final PasswordEncoder passwordEncoder;

    public void signup(AdminSignupRequest request) {
        if (adminRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username already taken. Please choose a different one.");
        }

        Admin admin = Admin.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .age(request.getAge())
                .experience(request.getExperience())
                .gender(request.getGender())
                .company(request.getCompany())
                .build();

        adminRepository.save(admin);
    }

    public AuthResponse signin(SigninRequest request, HttpServletResponse response) {
        Admin admin = adminRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid Username/Password"));

        if (!passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
            throw new RuntimeException("Invalid Username/Password");
        }

        String token = jwtUtil.generateToken(admin.getUsername(), admin.getId());

        // Max age 30 days in seconds
        cookieUtils.createCookie(response, "token", token, 30 * 24 * 60 * 60);

        // Hide password in response
        admin.setPassword(null);

        return AuthResponse.builder()
                .token(token)
                .user(admin)
                .build();
    }

    public void logout(HttpServletResponse response) {
        cookieUtils.clearCookie(response, "token");
    }

    public Admin teacherInfo(String adminId) {
        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found."));
        admin.setPassword(null);
        // populated courses logic will be handled if needed, or just return as is
        return admin;
    }

    public Admin editProfile(String adminId, EditAdminProfileRequest request) {
        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found."));

        if (request.getName() != null)
            admin.setName(request.getName());
        if (request.getAge() != null)
            admin.setAge(request.getAge());
        if (request.getExperience() != null)
            admin.setExperience(request.getExperience());
        if (request.getGender() != null)
            admin.setGender(request.getGender());
        if (request.getCompany() != null)
            admin.setCompany(request.getCompany());
        if (request.getBio() != null)
            admin.setBio(request.getBio());

        return adminRepository.save(admin);
    }

    public String updateAvatar(String adminId, org.springframework.web.multipart.MultipartFile file)
            throws java.io.IOException {
        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found."));

        // Delete old avatar if exists
        if (admin.getAvatar() != null && !admin.getAvatar().isEmpty()) {
            try {
                String publicId = admin.getAvatar().substring(admin.getAvatar().lastIndexOf("/") + 1,
                        admin.getAvatar().lastIndexOf("."));
                cloudinaryService.deleteFile(publicId);
            } catch (Exception e) {
                // Log and continue
            }
        }

        String imageUrl = cloudinaryService.uploadFile(file);
        admin.setAvatar(imageUrl);
        adminRepository.save(admin);
        return imageUrl;
    }

    public String createCourse(String adminId, CreateCourseRequest request,
            org.springframework.web.multipart.MultipartFile imageFile) throws java.io.IOException {
        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found."));

        String imageLink = cloudinaryService.uploadFile(imageFile);

        com.UPSKILL.Server.entities.Course course = com.UPSKILL.Server.entities.Course.builder()
                .title(request.getTitle())
                .description(request.getShortDescription())
                .bio(request.getDetailedDescription())
                .imageLink(imageLink)
                .price(request.getPrice())
                .teacher(adminId)
                .build();

        com.UPSKILL.Server.entities.Course savedCourse = courseRepository.save(course);

        if (admin.getCreatedCourses() == null) {
            admin.setCreatedCourses(new java.util.ArrayList<>());
        }
        admin.getCreatedCourses().add(savedCourse.getId());
        adminRepository.save(admin);

        return savedCourse.getId();
    }

    public java.util.List<com.UPSKILL.Server.entities.Course> adminSpecificCourses(String adminId) {
        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found."));

        if (admin.getCreatedCourses() == null || admin.getCreatedCourses().isEmpty()) {
            return new java.util.ArrayList<>();
        }

        return courseRepository.findByIdIn(admin.getCreatedCourses());
    }

    public com.UPSKILL.Server.entities.Video uploadVideo(String adminId, String courseId, String title,
            String description, Double duration,
            org.springframework.web.multipart.MultipartFile videoFile,
            org.springframework.web.multipart.MultipartFile thumbnailFile) throws java.io.IOException {

        com.UPSKILL.Server.entities.Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        String videoUrl = cloudinaryService.uploadFile(videoFile);
        String thumbnailUrl = cloudinaryService.uploadFile(thumbnailFile);

        com.UPSKILL.Server.entities.Video video = com.UPSKILL.Server.entities.Video.builder()
                .videoFile(videoUrl)
                .thumbnail(thumbnailUrl)
                .createdBy(adminId)
                .title(title)
                .description(description)
                .duration(duration)
                .belongsTo(courseId)
                .createdAt(java.time.LocalDateTime.now())
                .updatedAt(java.time.LocalDateTime.now())
                .build();

        com.UPSKILL.Server.entities.Video savedVideo = videoRepository.save(video);

        if (course.getVideos() == null) {
            course.setVideos(new java.util.ArrayList<>());
        }
        course.getVideos().add(savedVideo.getId());
        courseRepository.save(course);

        return savedVideo;
    }

    public void deleteVideo(String adminId, String courseId, String videoId) throws java.io.IOException {
        com.UPSKILL.Server.entities.Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        com.UPSKILL.Server.entities.Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new RuntimeException("Video not found"));

        if (!video.getCreatedBy().equals(adminId)) {
            throw new RuntimeException("Access Denied: You can only delete videos you created");
        }

        // Delete from Cloudinary
        if (video.getVideoFile() != null) {
            String publicId = video.getVideoFile().substring(video.getVideoFile().lastIndexOf("/") + 1,
                    video.getVideoFile().lastIndexOf("."));
            cloudinaryService.deleteFile(publicId);
        }

        // Remove from Course
        if (course.getVideos() != null) {
            course.getVideos().remove(videoId);
            courseRepository.save(course);
        }

        // Delete from DB
        videoRepository.deleteById(videoId);
    }

    public Admin teacherPage(String id) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found."));
        admin.setPassword(null);
        // populated courses logic or response mapping can be done in controller
        return admin;
    }
}
