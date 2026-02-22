package com.UPSKILL.Server.services;

import com.UPSKILL.Server.dto.AddReviewRequest;
import com.UPSKILL.Server.entities.Course;
import com.UPSKILL.Server.entities.Review;
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

    public Review editReview(String userId, String reviewId, String comment, Integer stars) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (!review.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized: You can only edit your own reviews");
        }

        Course course = courseRepository.findById(review.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // Adjust total stars
        course.setTotalStars(course.getTotalStars() - review.getStars() + stars);
        courseRepository.save(course);

        review.setComment(comment);
        review.setStars(stars);
        return reviewRepository.save(review);
    }

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
}
