package com.UPSKILL.Server.dto;

import lombok.Data;

@Data
public class UserSignupRequest {
    private String username;
    private String email;
    private String name;
    private String password;
    private String dob;
    private String gender;
    private String institution;
}
