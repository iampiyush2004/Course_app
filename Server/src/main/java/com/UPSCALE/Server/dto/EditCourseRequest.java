package com.UPSCALE.Server.dto;

import lombok.Data;
import java.util.List;

@Data
public class EditCourseRequest {
    private String title;
    private String description;
    private String imageLink;
    private Double price;
    private List<String> tags;
}
