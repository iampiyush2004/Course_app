package com.UPSCALE.Server.dto;

import lombok.Data;

@Data
public class AddReviewRequest {
    private String courseId;
    private String comment;
    private Integer stars;
}
