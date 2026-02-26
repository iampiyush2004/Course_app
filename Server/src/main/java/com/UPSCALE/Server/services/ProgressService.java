package com.UPSCALE.Server.services;

import com.UPSCALE.Server.entities.Progress;
import com.UPSCALE.Server.entities.User;
import com.UPSCALE.Server.repositories.ProgressRepository;
import com.UPSCALE.Server.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProgressService {

    private final ProgressRepository progressRepository;
    private final UserRepository userRepository;

    public Progress updateProgress(String userId, String courseId, Integer videoId, Double timeStamp) {
        Optional<Progress> existingProgress = progressRepository.findByCourseIdAndUserId(courseId, userId);

        Progress progress;
        if (existingProgress.isPresent()) {
            progress = existingProgress.get();
            progress.setVideoId(videoId);
            progress.setTimeStamp(timeStamp);
        } else {
            progress = Progress.builder()
                    .userId(userId)
                    .courseId(courseId)
                    .videoId(videoId)
                    .timeStamp(timeStamp)
                    .build();
        }

        Progress savedProgress = progressRepository.save(progress);

        // Update User lastWatched
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            user.setLastWatched(courseId);
            userRepository.save(user);
        }

        return savedProgress;
    }

    public Optional<Progress> getProgress(String userId, String courseId) {
        return progressRepository.findByCourseIdAndUserId(courseId, userId);
    }
}
