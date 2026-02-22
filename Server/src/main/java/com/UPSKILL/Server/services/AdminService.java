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
import java.util.ArrayList;
import java.util.List;

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

    private void validateSignup(String username, String password, String ageStr) {
        if (username == null || username.isEmpty()) {
            throw new RuntimeException("Username is required.");
        }
        if (Character.isDigit(username.charAt(0))) {
            throw new RuntimeException("Username should not start with a number.");
        }
        if (password == null || password.length() < 8) {
            throw new RuntimeException("Password must be at least 8 characters long.");
        }
        if (ageStr != null && !ageStr.isEmpty()) {
            try {
                int age = Integer.parseInt(ageStr);
                if (age < 21) {
                    throw new RuntimeException("You must be at least 21 years old to sign up as a teacher.");
                }
            } catch (NumberFormatException e) {
                // Ignore if not a number
            }
        } else {
            throw new RuntimeException("Age is required.");
        }
    }

    private static final String DEFAULT_AVATAR = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

    public void signup(AdminSignupRequest request, MultipartFile avatarFile) throws IOException {
        validateSignup(request.getUsername(), request.getPassword(), request.getAge());

        if (adminRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username already taken. Please choose a different one.");
        }

        String avatarUrl = DEFAULT_AVATAR;
        if (avatarFile != null && !avatarFile.isEmpty()) {
            avatarUrl = cloudinaryService.uploadFile(avatarFile);
        }

        Admin admin = Admin.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .age(request.getAge())
                .experience(request.getExperience())
                .gender(request.getGender())
                .company(request.getCompany())
                .avatar(avatarUrl)
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

    public java.util.Map<String, Object> teacherInfo(String adminId) {
        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found."));

        List<com.UPSKILL.Server.entities.Course> courses = new ArrayList<>();
        if (admin.getCreatedCourses() != null && !admin.getCreatedCourses().isEmpty()) {
            courses = courseRepository.findByIdIn(admin.getCreatedCourses());
        }

        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("_id", admin.getId());
        response.put("username", admin.getUsername());
        response.put("name", admin.getName());
        response.put("avatar", admin.getAvatar() != null ? admin.getAvatar() : DEFAULT_AVATAR);
        response.put("age", admin.getAge());
        response.put("experience", admin.getExperience());
        response.put("gender", admin.getGender());
        response.put("company", admin.getCompany());
        response.put("bio", admin.getBio());
        response.put("createdCourses", courses);

        return response;
    }

    public java.util.Map<String, Object> teacherPage(String id) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found."));

        List<com.UPSKILL.Server.entities.Course> courses = new ArrayList<>();
        if (admin.getCreatedCourses() != null && !admin.getCreatedCourses().isEmpty()) {
            courses = courseRepository.findByIdIn(admin.getCreatedCourses());
        }

        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("_id", admin.getId());
        response.put("username", admin.getUsername());
        response.put("name", admin.getName());
        response.put("avatar", admin.getAvatar() != null ? admin.getAvatar() : DEFAULT_AVATAR);
        response.put("age", admin.getAge());
        response.put("experience", admin.getExperience());
        response.put("gender", admin.getGender());
        response.put("company", admin.getCompany());
        response.put("bio", admin.getBio());
        response.put("createdCourses", courses);

        return response;
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

    public String updateAvatar(String adminId, MultipartFile file)
            throws IOException {
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
            MultipartFile imageFile) throws IOException {
        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found."));

        String imageLink = cloudinaryService.uploadFile(imageFile);

        // Parse tags — frontend sends them as a JSON string via FormData
        java.util.List<String> tags = new java.util.ArrayList<>();
        if (request.getTagsJson() != null && !request.getTagsJson().isBlank()) {
            try {
                com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                tags = mapper.readValue(request.getTagsJson(),
                        mapper.getTypeFactory().constructCollectionType(java.util.List.class, String.class));
            } catch (Exception e) {
                // Fallback: try as plain list from form binding
                if (request.getTags() != null)
                    tags = request.getTags();
            }
        } else if (request.getTags() != null) {
            tags = request.getTags();
        }

        com.UPSKILL.Server.entities.Course course = com.UPSKILL.Server.entities.Course.builder()
                .title(request.getTitle())
                .description(request.getShortDescription())
                .bio(request.getDetailedDescription())
                .imageLink(imageLink)
                .price(request.getPrice())
                .teacher(adminId)
                .tags(tags)
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

    public Video uploadVideo(String adminId, String courseId, String title,
            String description, Double duration,
            MultipartFile videoFile,
            MultipartFile thumbnailFile) throws IOException {

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

    public void deleteVideo(String adminId, String courseId, String videoId) throws IOException {
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

}
