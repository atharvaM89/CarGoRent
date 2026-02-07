package com.cargorent.controller;

import com.cargorent.entity.Company;
import com.cargorent.service.CompanyService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@lombok.extern.slf4j.Slf4j
public class AdminController {

    private final CompanyService companyService;

    public AdminController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @GetMapping("/companies")
    public ResponseEntity<List<Company>> getAllCompanies() {
        return ResponseEntity.ok(companyService.getAllCompanies());
    }

    @PostMapping("/companies/{id}/approve")
    public ResponseEntity<Void> approveCompany(@PathVariable Long id) {
        log.info("Received request to approve company ID: {}", id);
        companyService.approveCompany(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/companies/{id}/reject")
    public ResponseEntity<Void> rejectCompany(@PathVariable Long id) {
        companyService.rejectCompany(id);
        return ResponseEntity.ok().build();
    }
}
