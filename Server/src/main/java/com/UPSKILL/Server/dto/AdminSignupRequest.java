package com.UPSKILL.Server.dto;

import lombok.Data;

@Data
public class AdminSignupRequest {
    private String username;
    private String password;
    private String name;
    private String age;
    private Integer experience;
    private String gender;
    private String company;
    private String email;
}
