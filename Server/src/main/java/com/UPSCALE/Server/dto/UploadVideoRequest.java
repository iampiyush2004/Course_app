package com.UPSCALE.Server.dto;

import lombok.Data;

@Data
public class UploadVideoRequest {
    private String title;
    private String description;
    private Double duration;
}
