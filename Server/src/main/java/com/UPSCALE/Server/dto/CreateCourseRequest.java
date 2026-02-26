package com.UPSCALE.Server.dto;

import java.util.List;
import lombok.Data;

@Data
public class CreateCourseRequest {
    private String title;
    private String shortDescription;
    private String detailedDescription;
    private Double price;
    private List<String> tags;
    // Frontend sends tags as JSON string (e.g. '["java","spring"]') via FormData
    // We receive it as a raw string and parse it in the service
    private String tagsJson;
}
