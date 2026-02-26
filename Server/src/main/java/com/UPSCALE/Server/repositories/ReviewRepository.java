package com.UPSCALE.Server.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.UPSCALE.Server.entities.Review;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findByCourseId(String courseId);

    List<Review> findByAdminId(String adminId);

    List<Review> findByUserId(String userId);

    Optional<Review> findByCourseIdAndUserId(String courseId, String userId);

    Optional<Review> findByAdminIdAndUserId(String adminId, String userId);
}
