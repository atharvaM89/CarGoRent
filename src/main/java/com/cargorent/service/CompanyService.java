package com.cargorent.service;

import com.cargorent.entity.Company;

import java.util.List;

public interface CompanyService {

    Company createCompany(Company company);

    List<Company> getAllCompanies();
}