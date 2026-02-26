package com.UPSKILL.Server.services;

import com.UPSKILL.Server.dto.AddReviewRequest;
import com.UPSKILL.Server.entities.Admin;
import com.UPSKILL.Server.entities.Course;
import com.UPSKILL.Server.entities.Review;
import com.UPSKILL.Server.repositories.AdminRepository;
import com.UPSKILL.Server.repositories.CourseRepository;
import com.UPSKILL.Server.repositories.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final CourseRepository courseRepository;
    private final AdminRepository adminRepository;

    public List<Review> reviewsOfCourse(String courseId) {
        return reviewRepository.findByCourseId(courseId);
    }

    public Review addReview(String userId, AddReviewRequest request) {
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Review review = Review.builder()
                .userId(userId)
                .courseId(request.getCourseId())
                .comment(request.getComment())
                .stars(request.getStars())
                .build();

        Review savedReview = reviewRepository.save(review);

        // Update Course stats
        if (course.getReviews() == null)
            course.setReviews(new ArrayList<>());
        course.getReviews().add(savedReview.getId());

        course.setTotalStars((course.getTotalStars() != null ? course.getTotalStars() : 0) + request.getStars());
        course.setTotalReviews((course.getTotalReviews() != null ? course.getTotalReviews() : 0) + 1);

        courseRepository.save(course);
        return savedReview;
    }

    public Review editReviewByCourse(String userId, String courseId, String comment, Integer stars) {
        Review review = reviewRepository.findByCourseIdAndUserId(courseId, userId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // Adjust total stars
        course.setTotalStars(course.getTotalStars() - review.getStars() + stars);
        courseRepository.save(course);

        review.setComment(comment);
        review.setStars(stars);
        return reviewRepository.save(review);
    }

    // Legacy method kept if needed (edit by reviewId)
    public Review editReview(String userId, String reviewId, String comment, Integer stars) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (!review.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized: You can only edit your own reviews");
        }

        Course course = courseRepository.findById(review.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        course.setTotalStars(course.getTotalStars() - review.getStars() + stars);
        courseRepository.save(course);

        review.setComment(comment);
        review.setStars(stars);
        return reviewRepository.save(review);
    }

    public void deleteReviewByCourse(String userId, String courseId) {
        Review review = reviewRepository.findByCourseIdAndUserId(courseId, userId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        if (course.getReviews() != null)
            course.getReviews().remove(review.getId());
        course.setTotalStars(course.getTotalStars() - review.getStars());
        course.setTotalReviews(course.getTotalReviews() - 1);
        courseRepository.save(course);

        reviewRepository.deleteById(review.getId());
    }

    // Legacy method (delete by reviewId)
    public void deleteReview(String userId, String reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (!review.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        Course course = courseRepository.findById(review.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        course.getReviews().remove(reviewId);
        course.setTotalStars(course.getTotalStars() - review.getStars());
        course.setTotalReviews(course.getTotalReviews() - 1);
        courseRepository.save(course);

        reviewRepository.deleteById(reviewId);
    }

    public Optional<Review> studentReviewForCourse(String userId, String courseId) {
        return reviewRepository.findByCourseIdAndUserId(courseId, userId);
    }

    // Admin Review Methods

    public List<Review> reviewsOfAdmin(String adminId) {
        return reviewRepository.findByAdminId(adminId);
    }

    public Review addAdminReview(String userId, String adminId, AddReviewRequest request) {
        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        Review review = Review.builder()
                .userId(userId)
                .adminId(adminId)
                .comment(request.getComment())
                .stars(request.getStars())
                .build();

        Review savedReview = reviewRepository.save(review);

        // Update Admin stats
        admin.setTotalStars((admin.getTotalStars() != null ? admin.getTotalStars() : 0) + request.getStars());
        admin.setTotalReviews((admin.getTotalReviews() != null ? admin.getTotalReviews() : 0) + 1);

        adminRepository.save(admin);
        return savedReview;
    }

    public Review editAdminReviewByAdmin(String userId, String adminId, String comment, Integer stars) {
        Review review = reviewRepository.findByAdminIdAndUserId(adminId, userId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        // Adjust total stars
        admin.setTotalStars(admin.getTotalStars() - review.getStars() + stars);
        adminRepository.save(admin);

        review.setComment(comment);
        review.setStars(stars);
        return reviewRepository.save(review);
    }

    public void deleteAdminReviewByAdmin(String userId, String adminId) {
        Review review = reviewRepository.findByAdminIdAndUserId(adminId, userId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        admin.setTotalStars(admin.getTotalStars() - review.getStars());
        admin.setTotalReviews(admin.getTotalReviews() - 1);
        adminRepository.save(admin);

        reviewRepository.deleteById(review.getId());
    }

    public Optional<Review> studentReviewForAdmin(String userId, String adminId) {
        return reviewRepository.findByAdminIdAndUserId(adminId, userId);
    }
}
