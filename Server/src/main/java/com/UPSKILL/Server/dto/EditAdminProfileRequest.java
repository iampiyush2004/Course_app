package com.UPSKILL.Server.dto;

import lombok.Data;

@Data
public class EditAdminProfileRequest {
    private String name;
    private String age;
    private Integer experience;
    private String gender;
    private String company;
    private String bio;
}
