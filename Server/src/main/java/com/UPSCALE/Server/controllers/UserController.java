package com.UPSCALE.Server.controllers;

import com.UPSCALE.Server.dto.*;
import com.UPSCALE.Server.entities.Course;
import com.UPSCALE.Server.entities.User;
import com.UPSCALE.Server.services.PaymentService;
import com.UPSCALE.Server.services.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.razorpay.RazorpayException;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
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
        AuthResponse authResponse = userService.signin(request, response);
        response.setHeader("Authorization", "Bearer " + authResponse.getToken());
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        userService.logout(response);
        return ResponseEntity.ok(Map.of("message", "User Logged Out successfully!!!"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> returnMe(@AuthenticationPrincipal Object principal) {
        if (!(principal instanceof User user)) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(userService.getUserData(user.getId()));
    }

    @GetMapping("/myCourses")
    public ResponseEntity<?> myCourses(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(Map.of("courses", userService.myCourses(user.getId())));
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
    public ResponseEntity<?> createOrder(@AuthenticationPrincipal User user, @RequestBody Map<String, Object> body)
            throws Exception {
        Double amount = Double.valueOf(body.get("amount").toString());
        String orderJson = paymentService.createOrder(amount);

        // Return structured JSON as expected by frontend
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("order", new ObjectMapper().readValue(orderJson, Map.class));
        return ResponseEntity.ok(response);
    }

    @PostMapping("/buyCourse/capture")
    public ResponseEntity<?> capturePayment(@AuthenticationPrincipal User user, @RequestBody Map<String, Object> body)
            throws RazorpayException {
        String courseId = (String) body.get("courseId");
        String paymentId = (String) body.get("paymentId");
        Double amount = Double.valueOf(body.get("amount").toString());

        boolean success = paymentService.capturePayment(user.getId(), courseId, paymentId, amount);
        return ResponseEntity.ok(Map.of("success", success, "message",
                success ? "Payment captured successfully" : "Payment capture failed"));
    }

    @GetMapping("/hasPurchased/{courseId}")
    public ResponseEntity<?> hasPurchased(@AuthenticationPrincipal User user, @PathVariable String courseId) {
        return ResponseEntity.ok(Map.of(
                "success", true,
                "hasPurchased", paymentService.isCoursePurchased(user.getId(), courseId)));
    }

    @GetMapping("/loggedin")
    public ResponseEntity<?> isLoggedin(@AuthenticationPrincipal Object principal) {
        if (principal instanceof User user) {
            return ResponseEntity.ok(Map.of(
                    "message", "Student is Logged In",
                    "isLoggedin", true,
                    "user", userService.getFullUserData(user.getId())));
        }
        return ResponseEntity.ok(Map.of(
                "message", "Student is not Logged In",
                "isLoggedin", false));
    }

    @GetMapping("/lastWatched")
    public ResponseEntity<Course> lastWatched(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(userService.lastWatched(user.getId()));
    }
}
