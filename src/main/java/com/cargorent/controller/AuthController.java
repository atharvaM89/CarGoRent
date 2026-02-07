package com.cargorent.controller;

import com.cargorent.dto.LoginRequest;
import com.cargorent.dto.LoginResponse;
import com.cargorent.entity.User;
import com.cargorent.exception.BadRequestException;
import com.cargorent.repository.UserRepository;
import com.cargorent.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    private final com.cargorent.repository.CompanyRepository companyRepository;

    public AuthController(UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            com.cargorent.repository.CompanyRepository companyRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.companyRepository = companyRepository;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid email or password");
        }

        String token = jwtUtil.generateAccessToken(user.getId(), user.getRole().name()); // Re-generate? user context is
                                                                                         // same.
        com.cargorent.entity.Company company = getCompanyIfApplicable(user);
        Long companyId = company != null ? company.getId() : null;
        boolean isCompanyActive = company != null && company.isActive();

        return new LoginResponse(
                token,
                user.getRole().name(),
                user.getId(),
                companyId,
                isCompanyActive);
    }

    @GetMapping("/me")
    public LoginResponse getCurrentUser() {
        var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof com.cargorent.security.UserPrincipal)) {
            throw new BadRequestException("User not found");
        }
        com.cargorent.security.UserPrincipal principal = (com.cargorent.security.UserPrincipal) auth.getPrincipal();
        Long userId = principal.getUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BadRequestException("User not found"));

        com.cargorent.entity.Company company = getCompanyIfApplicable(user);
        Long companyId = company != null ? company.getId() : null;
        boolean isCompanyActive = company != null && company.isActive();

        return new LoginResponse(
                null,
                user.getRole().name(),
                user.getId(),
                companyId,
                isCompanyActive);
    }

    private com.cargorent.entity.Company getCompanyIfApplicable(User user) {
        if (user.getRole() == com.cargorent.entity.Role.COMPANY) {
            return companyRepository.findByUser(user).orElse(null);
        }
        return null;
    }
}