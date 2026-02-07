package com.cargorent.service.impl;

import com.cargorent.entity.User;
import com.cargorent.exception.BadRequestException;
import com.cargorent.repository.UserRepository;
import com.cargorent.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@org.springframework.transaction.annotation.Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final com.cargorent.repository.CompanyRepository companyRepository;

    public UserServiceImpl(UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            com.cargorent.repository.CompanyRepository companyRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.companyRepository = companyRepository;
    }

    @Override
    public User registerUser(User user) {

        userRepository.findByEmail(user.getEmail())
                .ifPresent(u -> {
                    throw new BadRequestException("Email already registered");
                });

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setCreatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);

        // Auto-create Company profile if role is COMPANY
        if (savedUser.getRole() == com.cargorent.entity.Role.COMPANY) {
            com.cargorent.entity.Company company = new com.cargorent.entity.Company();
            company.setCompanyName(savedUser.getName());
            company.setUser(savedUser);
            company.setActive(false); // Inactive by default, requires Admin approval
            company.setAddress("Location not provided");
            companyRepository.save(company);
        }

        return savedUser;
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}