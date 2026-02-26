package com.UPSCALE.Server.dto;

import lombok.Data;

@Data
public class EditAdminProfileRequest {
    private String name;
    private String dob;
    private Integer experience;
    private String gender;
    private String company;
    private String bio;
}
