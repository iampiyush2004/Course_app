package com.UPSKILL.Server.controllers;

import com.UPSKILL.Server.dto.AddReviewRequest;
import com.UPSKILL.Server.entities.Review;
import com.UPSKILL.Server.entities.User;
import com.UPSKILL.Server.services.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/review")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Review>> reviewsOfCourse(@PathVariable String courseId) {
        return ResponseEntity.ok(reviewService.reviewsOfCourse(courseId));
    }

    @PostMapping("/{courseId}")
    public ResponseEntity<?> addReview(@AuthenticationPrincipal User user, @RequestBody AddReviewRequest request) {
        return ResponseEntity.ok(reviewService.addReview(user.getId(), request));
    }

    @PutMapping("/edit/{reviewId}")
    public ResponseEntity<?> editReview(@AuthenticationPrincipal User user, @PathVariable String reviewId,
            @RequestBody Map<String, Object> body) {
        String comment = (String) body.get("comment");
        Integer stars = (Integer) body.get("stars");
        return ResponseEntity.ok(reviewService.editReview(user.getId(), reviewId, comment, stars));
    }

    @GetMapping("/student/{courseId}")
    public ResponseEntity<?> studentReviewForCourse(@AuthenticationPrincipal User user, @PathVariable String courseId) {
        return ResponseEntity.ok(reviewService.studentReviewForCourse(user.getId(), courseId).orElse(null));
    }

    @DeleteMapping("/student/{reviewId}")
    public ResponseEntity<?> deleteReview(@AuthenticationPrincipal User user, @PathVariable String reviewId) {
        reviewService.deleteReview(user.getId(), reviewId);
        return ResponseEntity.ok(Map.of("message", "Review deleted successfully"));
    }
}
