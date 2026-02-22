package com.UPSKILL.Server.controllers;

import com.UPSKILL.Server.dto.*;
import com.UPSKILL.Server.entities.Course;
import com.UPSKILL.Server.entities.User;
import com.UPSKILL.Server.services.PaymentService;
import com.UPSKILL.Server.services.UserService;
import com.razorpay.RazorpayException;
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
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final PaymentService paymentService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@ModelAttribute UserSignupRequest request,
            @RequestParam(value = "avatar", required = false) MultipartFile file) throws IOException {
        User user = userService.signup(request, file);
        return ResponseEntity.ok(Map.of("message", "User created Successfully", "user", user));
    }

    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signin(@RequestBody SigninRequest request, HttpServletResponse response) {
        return ResponseEntity.ok(userService.signin(request, response));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        userService.logout(response);
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    @GetMapping("/me")
    public ResponseEntity<User> returnMe(@AuthenticationPrincipal User user) {
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/myCourses")
    public ResponseEntity<List<Course>> myCourses(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(userService.myCourses(user.getId()));
    }

    @PutMapping("/editProfile")
    public ResponseEntity<User> editProfile(@AuthenticationPrincipal User user,
            @RequestBody EditUserProfileRequest request) {
        return ResponseEntity.ok(userService.editUserProfile(user.getId(), request));
    }

    @PutMapping("/updateAvatar")
    public ResponseEntity<?> updateAvatar(@AuthenticationPrincipal User user, @RequestParam("file") MultipartFile file)
            throws IOException {
        String url = userService.updateUserAvatar(user.getId(), file);
        return ResponseEntity.ok(Map.of("imageUrl", url));
    }

    @PostMapping("/buyCourse/order")
    public ResponseEntity<?> createOrder(@AuthenticationPrincipal User user, @RequestBody Map<String, Double> body)
            throws RazorpayException {
        String order = paymentService.createOrder(body.get("amount"));
        return ResponseEntity.ok(order);
    }

    @PostMapping("/buyCourse/capture")
    public ResponseEntity<?> capturePayment(@AuthenticationPrincipal User user, @RequestBody Map<String, Object> body)
            throws RazorpayException {
        String courseId = (String) body.get("courseId");
        String paymentId = (String) body.get("paymentId");
        Double amount = Double.valueOf(body.get("amount").toString());

        boolean success = paymentService.capturePayment(user.getId(), courseId, paymentId, amount);
        if (success) {
            return ResponseEntity.ok(Map.of("message", "Payment captured successfully"));
        }
        return ResponseEntity.status(400).body(Map.of("message", "Payment capture failed"));
    }

    @GetMapping("/hasPurchased/{courseId}")
    public ResponseEntity<?> hasPurchased(@AuthenticationPrincipal User user, @PathVariable String courseId) {
        return ResponseEntity.ok(Map.of("hasPurchased", paymentService.isCoursePurchased(user.getId(), courseId)));
    }

    @GetMapping("/loggedin")
    public ResponseEntity<?> isLoggedin(@AuthenticationPrincipal User user) {
        if (user != null) {
            user.setPassword(null);
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.ok(Map.of("message", "Not logged in"));
    }

    @GetMapping("/lastWatched")
    public ResponseEntity<Course> lastWatched(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(userService.lastWatched(user.getId()));
    }
}
