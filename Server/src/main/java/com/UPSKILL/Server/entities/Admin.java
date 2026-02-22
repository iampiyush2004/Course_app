package com.UPSKILL.Server.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "admins")
public class Admin {
    @Id
    private String id;

    private String name;
    private String age;
    private Integer experience;
    private String gender;
    private String company;
    private String bio;
    private String avatar;

    @Indexed(unique = true)
    private String username;

    private String password;

    private List<String> createdCourses; // List of Course IDs
}
