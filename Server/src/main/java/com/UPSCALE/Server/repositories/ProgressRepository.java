package com.UPSCALE.Server.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.UPSCALE.Server.entities.Progress;

import java.util.Optional;

public interface ProgressRepository extends MongoRepository<Progress, String> {
    Optional<Progress> findByCourseIdAndUserId(String courseId, String userId);
}
