package com.UPSKILL.Server.dto;

import lombok.Data;

@Data
public class CreateCourseRequest {
    private String title;
    private String shortDescription;
    private String detailedDescription;
    private Double price;
    private java.util.List<String> tags;
}
