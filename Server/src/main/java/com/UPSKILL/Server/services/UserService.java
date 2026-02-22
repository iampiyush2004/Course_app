package com.UPSKILL.Server.services;

import com.UPSKILL.Server.dto.*;
import com.UPSKILL.Server.entities.Course;
import com.UPSKILL.Server.entities.User;
import com.UPSKILL.Server.repositories.CourseRepository;
import com.UPSKILL.Server.repositories.UserRepository;
import com.UPSKILL.Server.utils.CloudinaryService;
import com.UPSKILL.Server.utils.CookieUtils;
import com.UPSKILL.Server.utils.JwtUtil;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final JwtUtil jwtUtil;
    private final CookieUtils cookieUtils;
    private final CloudinaryService cloudinaryService;
    private final PasswordEncoder passwordEncoder;

    public User signup(UserSignupRequest request, MultipartFile avatarFile) throws IOException {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username already taken. Please choose a different one.");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already taken. Please choose a different one.");
        }

        String avatarUrl = null;
        if (avatarFile != null && !avatarFile.isEmpty()) {
            avatarUrl = cloudinaryService.uploadFile(avatarFile);
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .name(request.getName())
                .password(passwordEncoder.encode(request.getPassword()))
                .dob(request.getDob())
                .gender(request.getGender())
                .avatar(avatarUrl)
                .institution(request.getInstitution())
                .coursePurchased(new ArrayList<>())
                .build();

        return userRepository.save(user);
    }

    public AuthResponse signin(SigninRequest request, HttpServletResponse response) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid Username/Password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid Username/Password");
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getId());
        cookieUtils.createCookie(response, "token", token, 30 * 24 * 60 * 60);

        user.setPassword(null);
        return AuthResponse.builder()
                .token(token)
                .user(user)
                .build();
    }

    public void logout(HttpServletResponse response) {
        cookieUtils.clearCookie(response, "token");
    }

    public List<Course> myCourses(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getCoursePurchased() == null || user.getCoursePurchased().isEmpty()) {
            return new ArrayList<>();
        }

        return courseRepository.findByIdIn(user.getCoursePurchased());
    }

    public User editUserProfile(String userId, EditUserProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getUsername() != null)
            user.setUsername(request.getUsername());
        if (request.getEmail() != null)
            user.setEmail(request.getEmail());
        if (request.getName() != null)
            user.setName(request.getName());
        if (request.getDob() != null)
            user.setDob(request.getDob());
        if (request.getGender() != null)
            user.setGender(request.getGender());
        if (request.getInstitution() != null)
            user.setInstitution(request.getInstitution());

        return userRepository.save(user);
    }

    public String updateUserAvatar(String userId, MultipartFile file) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getAvatar() != null && !user.getAvatar().isEmpty()) {
            try {
                String publicId = user.getAvatar().substring(user.getAvatar().lastIndexOf("/") + 1,
                        user.getAvatar().lastIndexOf("."));
                cloudinaryService.deleteFile(publicId);
            } catch (Exception e) {
                // Ignore
            }
        }

        String imageUrl = cloudinaryService.uploadFile(file);
        user.setAvatar(imageUrl);
        userRepository.save(user);
        return imageUrl;
    }

    public Course lastWatched(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getLastWatched() == null) {
            return null;
        }

        return courseRepository.findById(user.getLastWatched()).orElse(null);
    }
}
