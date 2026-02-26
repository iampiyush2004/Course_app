package com.UPSKILL.Server.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.Transient;
import java.time.LocalDate;
import java.time.Period;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "admins")
public class Admin {
    @Id
    @JsonProperty("_id")
    private String id;

    private String name;
    private String dob;
    private Integer experience;
    private String gender;
    private String company;
    @Indexed(unique = true)
    private String email;
    private String bio;
    private String avatar;

    @Indexed(unique = true)
    private String username;

    private String password;

    private List<String> createdCourses; // List of Course IDs

    private Double totalStars; // Sum of all teacher review stars
    private Integer totalReviews; // Count of all teacher reviews

    @Transient
    private Integer age;

    public Integer getAge() {
        if (dob == null || dob.isEmpty())
            return null;
        try {
            return Period.between(LocalDate.parse(dob), LocalDate.now()).getYears();
        } catch (Exception e) {
            return null;
        }
    }
}
