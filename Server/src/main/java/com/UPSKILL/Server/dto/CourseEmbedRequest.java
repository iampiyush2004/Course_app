package com.UPSKILL.Server.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseEmbedRequest {
    private String id;
    private String title;
    private String description;
    private String bio;
    private List<String> tags;
}
