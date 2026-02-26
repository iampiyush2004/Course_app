package com.UPSKILL.Server.controllers;

import com.UPSKILL.Server.dto.AddReviewRequest;
import com.UPSKILL.Server.entities.Review;
import com.UPSKILL.Server.entities.User;
import com.UPSKILL.Server.services.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/review")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // GET all reviews for a course (public)
    @GetMapping("/course/{courseId}")
    public ResponseEntity<?> reviewsOfCourse(@PathVariable String courseId) {
        return ResponseEntity.ok(Map.of("success", true, "reviews", reviewService.reviewsOfCourse(courseId)));
    }

    // POST a new review — frontend sends courseId in URL path, not body
    @PostMapping("/{courseId}")
    public ResponseEntity<?> addReview(@AuthenticationPrincipal User user,
            @PathVariable String courseId,
            @RequestBody AddReviewRequest request) {
        request.setCourseId(courseId);
        return ResponseEntity.ok(Map.of("review", reviewService.addReview(user.getId(), request)));
    }

    // PUT edit review — original backend uses courseId (not reviewId) in path
    // and finds review by {courseId, userId}
    @PutMapping("/edit/{courseId}")
    public ResponseEntity<?> editReview(@AuthenticationPrincipal User user,
            @PathVariable String courseId,
            @RequestBody Map<String, Object> body) {
        String comment = (String) body.get("comment");
        Integer stars = (Integer) body.get("stars");
        return ResponseEntity.ok(reviewService.editReviewByCourse(user.getId(), courseId, comment, stars));
    }

    // GET student's own review for a course
    @GetMapping("/student/{courseId}")
    public ResponseEntity<?> studentReviewForCourse(@AuthenticationPrincipal User user,
            @PathVariable String courseId) {
        Review review = reviewService.studentReviewForCourse(user.getId(), courseId).orElse(null);
        if (review == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(Map.of("review", review));
    }

    // DELETE student's review for a course
    @DeleteMapping("/student/{courseId}")
    public ResponseEntity<?> deleteReview(@AuthenticationPrincipal User user,
            @PathVariable String courseId) {
        reviewService.deleteReviewByCourse(user.getId(), courseId);
        return ResponseEntity.ok(Map.of("message", "Review deleted successfully"));
    }

    // --- Admin (Teacher) Review Endpoints ---

    // GET all reviews for an admin
    @GetMapping("/admin/{adminId}")
    public ResponseEntity<?> reviewsOfAdmin(@PathVariable String adminId) {
        return ResponseEntity.ok(Map.of("success", true, "reviews", reviewService.reviewsOfAdmin(adminId)));
    }

    // POST a new review for an admin
    @PostMapping("/admin/{adminId}")
    public ResponseEntity<?> addAdminReview(@AuthenticationPrincipal User user,
            @PathVariable String adminId,
            @RequestBody AddReviewRequest request) {
        return ResponseEntity.ok(Map.of("review", reviewService.addAdminReview(user.getId(), adminId, request)));
    }

    // PUT edit admin review
    @PutMapping("/admin/edit/{adminId}")
    public ResponseEntity<?> editAdminReview(@AuthenticationPrincipal User user,
            @PathVariable String adminId,
            @RequestBody Map<String, Object> body) {
        String comment = (String) body.get("comment");
        Integer stars = (Integer) body.get("stars");
        return ResponseEntity.ok(reviewService.editAdminReviewByAdmin(user.getId(), adminId, comment, stars));
    }

    // GET student's own review for an admin
    @GetMapping("/admin/student/{adminId}")
    public ResponseEntity<?> studentReviewForAdmin(@AuthenticationPrincipal User user,
            @PathVariable String adminId) {
        Review review = reviewService.studentReviewForAdmin(user.getId(), adminId).orElse(null);
        if (review == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(Map.of("review", review));
    }

    // DELETE student's review for an admin
    @DeleteMapping("/admin/student/{adminId}")
    public ResponseEntity<?> deleteAdminReview(@AuthenticationPrincipal User user,
            @PathVariable String adminId) {
        reviewService.deleteAdminReviewByAdmin(user.getId(), adminId);
        return ResponseEntity.ok(Map.of("message", "Review deleted successfully"));
    }
}
