package com.UPSKILL.Server.services;

import com.UPSKILL.Server.dto.CourseEmbedRequest;
import com.UPSKILL.Server.entities.Course;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@Slf4j
public class ChatbotService {

    @Value("${chatbot.url:http://localhost:8001}")
    private String chatbotUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @Async
    public void embedCourse(Course course) {
        try {
            CourseEmbedRequest request = CourseEmbedRequest.builder()
                    .id(course.getId())
                    .title(course.getTitle())
                    .description(course.getDescription())
                    .bio(course.getBio())
                    .tags(course.getTags())
                    .build();

            restTemplate.postForObject(chatbotUrl + "/embed", request, String.class);
            log.info("Successfully sent course {} to chatbot for embedding", course.getId());
        } catch (Exception e) {
            log.error("Failed to send course {} to chatbot: {}", course.getId(), e.getMessage());
        }
    }
}
