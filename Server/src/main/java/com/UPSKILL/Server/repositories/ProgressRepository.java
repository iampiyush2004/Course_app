package com.UPSKILL.Server.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.UPSKILL.Server.entities.Progress;

import java.util.Optional;

public interface ProgressRepository extends MongoRepository<Progress, String> {
    Optional<Progress> findByCourseIdAndUserId(String courseId, String userId);
}
