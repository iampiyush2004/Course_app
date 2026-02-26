package com.UPSCALE.Server.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "progresses")
public class Progress {
    @Id
    private String id;
    private String courseId;
    private String userId;

    @Builder.Default
    private Integer videoId = 0;

    @Builder.Default
    private Double timeStamp = 0.0;
}
