package com.UPSKILL.Server.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "courses")
public class Course {
    @Id
    @JsonProperty("_id")
    private String id;
    private String title;
    private String description;
    private String bio;
    private String imageLink;
    private Double price;
    private Boolean isCompleted;
    private Integer usersEnrolled;
    private String category;
    private String teacher; // Admin ID
    private List<String> reviews; // List of Review IDs
    private List<String> videos; // List of Video IDs
    private Double totalStars;
    private Integer totalReviews;
    private List<String> tags;
}
