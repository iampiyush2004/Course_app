package com.UPSCALE.Server.services;

import com.UPSCALE.Server.dto.EditCourseRequest;
import com.UPSCALE.Server.entities.Admin;
import com.UPSCALE.Server.entities.Course;
import com.UPSCALE.Server.entities.Video;
import com.UPSCALE.Server.repositories.AdminRepository;
import com.UPSCALE.Server.repositories.CourseRepository;
import com.UPSCALE.Server.repositories.VideoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final AdminRepository adminRepository;
    private final VideoRepository videoRepository;
    private final ChatbotService chatbotService;

    public List<Course> viewAllCourses() {
        return courseRepository.findAll();
    }

    public Map<String, Object> viewCourse(String courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found."));

        // Populate teacher
        Admin teacher = null;
        if (course.getTeacher() != null) {
            teacher = adminRepository.findById(course.getTeacher()).orElse(null);
            if (teacher != null)
                teacher.setPassword(null);
        }

        // Populate videos (excluding videoFile - logic done in controller usually, but
        // here DTO can help)
        List<Video> videos = new ArrayList<>();
        if (course.getVideos() != null) {
            videos = videoRepository.findAllById(course.getVideos());
            // Mirror Express: select("-videoFile")
            for (Video v : videos) {
                v.setVideoFile(null);
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("_id", course.getId());
        response.put("title", course.getTitle());
        response.put("description", course.getDescription());
        response.put("bio", course.getBio());
        response.put("imageLink", course.getImageLink());
        response.put("price", course.getPrice());
        response.put("teacher", teacher);
        response.put("videos", videos);
        response.put("tags", course.getTags());
        response.put("users", course.getUsersEnrolled()); // Map usersEnrolled to users
        response.put("rating", 4); // Default rating if not in DB

        return response;
    }

    public Map<String, Object> viewVids(String courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found."));

        Admin teacher = null;
        if (course.getTeacher() != null) {
            teacher = adminRepository.findById(course.getTeacher()).orElse(null);
            if (teacher != null)
                teacher.setPassword(null);
        }

        List<Video> videos = new ArrayList<>();
        if (course.getVideos() != null) {
            videos = videoRepository.findAllById(course.getVideos());
        }

        Map<String, Object> response = new HashMap<>();
        response.put("_id", course.getId());
        response.put("course", course); // Some frontend parts might expect the course object itself
        response.put("title", course.getTitle());
        response.put("teacher", teacher);
        response.put("videos", videos);

        return response;
    }

    public void deleteCourse(String adminId, String courseId) {
        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found."));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found."));

        if (admin.getCreatedCourses() != null) {
            admin.getCreatedCourses().remove(courseId);
            adminRepository.save(admin);
        }

        courseRepository.deleteById(courseId);
    }

    public Course editCourse(String adminId, String courseId, EditCourseRequest request) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found."));

        if (!course.getTeacher().equals(adminId)) {
            throw new RuntimeException("Unauthorized Access!!!");
        }

        if (request.getTitle() != null)
            course.setTitle(request.getTitle());
        if (request.getDescription() != null)
            course.setDescription(request.getDescription());
        if (request.getImageLink() != null)
            course.setImageLink(request.getImageLink());
        if (request.getPrice() != null)
            course.setPrice(request.getPrice());
        if (request.getTags() != null)
            course.setTags(request.getTags());

        Course updatedCourse = courseRepository.save(course);

        // Trigger chatbot re-embedding
        chatbotService.embedCourse(updatedCourse);

        return updatedCourse;
    }
}
