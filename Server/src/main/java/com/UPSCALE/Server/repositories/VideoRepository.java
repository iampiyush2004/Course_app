package com.UPSCALE.Server.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.UPSCALE.Server.entities.Video;

import java.util.List;

public interface VideoRepository extends MongoRepository<Video, String> {
    List<Video> findByBelongsTo(String courseId);
}
