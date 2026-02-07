package com.cargorent.repository;

import com.cargorent.entity.Company;
import com.cargorent.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, Long> {
    Optional<Company> findByUser(User user);

    Optional<Company> findByUser_Id(Long userId);

    boolean existsByUser_Id(Long userId);

    List<Company> findByIsActiveTrue();

    java.util.Optional<Company> findByCompanyType(com.cargorent.entity.CompanyType companyType);
}