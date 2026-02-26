package com.UPSCALE.Server.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.UPSCALE.Server.entities.User;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);
}
