package com.UPSCALE.Server.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "videos")
public class Video {
    @Id
    @JsonProperty("_id")
    private String id;
    private String videoFile;
    private String thumbnail;
    private String createdBy; // Admin ID
    private String title;
    private String description;
    private Double duration;

    @Builder.Default
    private Integer views = 0;

    @Builder.Default
    private Boolean isPublished = true;

    private String belongsTo; // Course ID

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
