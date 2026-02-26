package com.UPSCALE.Server.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.UPSCALE.Server.entities.Course;

import java.util.List;

public interface CourseRepository extends MongoRepository<Course, String> {
    List<Course> findByIdIn(List<String> ids);
}
