package com.UPSCALE.Server.dto;

import lombok.Data;

@Data
public class EditUserProfileRequest {
    private String username;
    private String email;
    private String name;
    private String dob;
    private String gender;
    private String institution;
}
