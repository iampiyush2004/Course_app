package com.UPSKILL.Server.services;

import com.UPSKILL.Server.dto.*;
import com.UPSKILL.Server.entities.Course;
import com.UPSKILL.Server.entities.User;
import com.UPSKILL.Server.repositories.CourseRepository;
import com.UPSKILL.Server.repositories.UserRepository;
import com.UPSKILL.Server.utils.CloudinaryService;
import com.UPSKILL.Server.utils.CookieUtils;
import com.UPSKILL.Server.utils.JwtUtil;
import com.UPSKILL.Server.utils.MailService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeParseException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final JwtUtil jwtUtil;
    private final CookieUtils cookieUtils;
    private final CloudinaryService cloudinaryService;
    private final PasswordEncoder passwordEncoder;
    private final MailService mailService;

    private void validateSignup(String username, String password, String email, String dob) {
        if (username == null || username.isEmpty()) {
            throw new RuntimeException("Username is required.");
        }
        if (Character.isDigit(username.charAt(0))) {
            throw new RuntimeException("Username should not start with a number.");
        }
        if (password == null || password.length() < 8) {
            throw new RuntimeException("Password must be at least 8 characters long.");
        }
        if (email != null && !email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new RuntimeException("Invalid email format.");
        }
        if (dob != null && !dob.isEmpty()) {
            try {
                LocalDate birthDate = LocalDate.parse(dob);
                int age = Period.between(birthDate, LocalDate.now()).getYears();
                if (age < 15) {
                    throw new RuntimeException("You must be at least 15 years old to sign up.");
                }
            } catch (DateTimeParseException | NumberFormatException e) {
                // If parsing fails, we could optionally try parsing as age integer for backward
                // compatibility
                try {
                    int age = Integer.parseInt(dob);
                    if (age < 15) {
                        throw new RuntimeException("You must be at least 15 years old to sign up.");
                    }
                } catch (NumberFormatException nfe) {
                    // Ignore or log
                }
            }
        } else {
            throw new RuntimeException("Age/DOB is required.");
        }
    }

    private int calculateAge(String dob) {
        if (dob == null || dob.isEmpty())
            return 0;
        try {
            LocalDate birthDate = LocalDate.parse(dob);
            return Period.between(birthDate, LocalDate.now()).getYears();
        } catch (DateTimeParseException | NumberFormatException e) {
            return 0;
        }
    }

    private static final String DEFAULT_AVATAR = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

    public User signup(UserSignupRequest request, MultipartFile avatarFile) throws IOException {
        validateSignup(request.getUsername(), request.getPassword(), request.getEmail(), request.getDob());

        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username already taken. Please choose a different one.");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already taken. Please choose a different one.");
        }

        String avatarUrl = DEFAULT_AVATAR;
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
        User savedUser = userRepository.save(user);

        // Send Welcome Email with recommendations
        try {
            List<Course> allCourses = courseRepository.findAll();
            Collections.shuffle(allCourses);
            List<Course> recommendations = allCourses.subList(0, Math.min(allCourses.size(), 5));
            mailService.sendWelcomeEmail(savedUser.getEmail(), savedUser.getName(), recommendations);
        } catch (Exception e) {
            log.error("Could not send welcome email: {}", e.getMessage());
        }

        return savedUser;
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

    public Map<String, Object> getUserData(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> response = new HashMap<>();
        response.put("_id", user.getId());
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());
        response.put("name", user.getName());
        response.put("avatar", user.getAvatar() != null ? user.getAvatar() : DEFAULT_AVATAR);
        response.put("coursePurchased",
                user.getCoursePurchased() != null ? user.getCoursePurchased() : new ArrayList<>());
        response.put("lastWatched", user.getLastWatched());
        response.put("dob", user.getDob());
        response.put("age", calculateAge(user.getDob()));
        response.put("gender", user.getGender());
        response.put("institution", user.getInstitution());

        return response;
    }

    public Map<String, Object> getFullUserData(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Course> purchasedCourses = new ArrayList<>();
        if (user.getCoursePurchased() != null && !user.getCoursePurchased().isEmpty()) {
            purchasedCourses = courseRepository.findByIdIn(user.getCoursePurchased());
        }

        Course lastWatchedCourse = null;
        if (user.getLastWatched() != null) {
            lastWatchedCourse = courseRepository.findById(user.getLastWatched()).orElse(null);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("_id", user.getId());
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());
        response.put("name", user.getName());
        response.put("avatar", user.getAvatar() != null ? user.getAvatar() : DEFAULT_AVATAR);
        response.put("coursePurchased", purchasedCourses);
        response.put("lastWatched", lastWatchedCourse);
        response.put("dob", user.getDob());
        response.put("age", calculateAge(user.getDob()));
        response.put("gender", user.getGender());
        response.put("institution", user.getInstitution());

        return response;
    }
}
