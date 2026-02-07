package com.cargorent.config;

import com.cargorent.entity.Company;
import com.cargorent.entity.CompanyType;
import com.cargorent.entity.Role;
import com.cargorent.entity.User;
import com.cargorent.repository.CompanyRepository;
import com.cargorent.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class SystemDataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;

    public SystemDataInitializer(UserRepository userRepository, CompanyRepository companyRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        initializeSystemCompany();
    }

    private void initializeSystemCompany() {
        if (companyRepository.findByCompanyType(CompanyType.SYSTEM).isPresent()) {
            return;
        }

        System.out.println("⚙️ Initializing System Company: Members Fleet...");

        // 1. Create System User if not exists
        String systemEmail = "system@cargorent.com";
        User systemUser = userRepository.findByEmail(systemEmail)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(systemEmail);
                    newUser.setName("System Admin");
                    newUser.setPassword(passwordEncoder.encode("SystemStrongPassword123!"));
                    newUser.setRole(Role.ADMIN);
                    return userRepository.save(newUser);
                });

        // 2. Create System Company
        Company membersFleet = Company.builder()
                .companyName("Members Fleet")
                .address("Global Digital Fleet")
                .isActive(true)
                .user(systemUser)
                .companyType(CompanyType.SYSTEM)
                .build();

        companyRepository.save(membersFleet);
        System.out.println("✅ System Company 'Members Fleet' created successfully.");
    }
}
