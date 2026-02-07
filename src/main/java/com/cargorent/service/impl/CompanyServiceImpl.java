package com.cargorent.service.impl;

import com.cargorent.entity.Company;
import com.cargorent.repository.CompanyRepository;
import com.cargorent.service.CompanyService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@lombok.extern.slf4j.Slf4j
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyServiceImpl(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    @Override
    public Company createCompany(Company company) {
        return companyRepository.save(company);
    }

    @Override
    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    @Override
    public List<Company> getActiveCompanies() {
        return companyRepository.findByIsActiveTrue();
    }

    @Override
    public void approveCompany(Long companyId) {
        log.info("Attempting to approve company with ID: {}", companyId);
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new com.cargorent.exception.ResourceNotFoundException("Company not found"));
        company.setActive(true);
        companyRepository.save(company);
        log.info("Company with ID: {} approved successfully", companyId);
    }

    @Override
    public void rejectCompany(Long companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new com.cargorent.exception.ResourceNotFoundException("Company not found"));
        company.setActive(false);
        companyRepository.save(company);
    }
}