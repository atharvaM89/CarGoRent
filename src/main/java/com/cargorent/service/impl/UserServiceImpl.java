package com.cargorent.service.impl;

import com.cargorent.entity.User;
import com.cargorent.repository.UserRepository;
import com.cargorent.service.UserService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User registerUser(User user) {
        userRepository.findByEmail(user.getEmail())
                .ifPresent(existing -> {
                    throw new RuntimeException("Email already registered");
                });

        return userRepository.save(user);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}