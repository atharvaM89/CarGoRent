package com.cargorent.controller;

import com.cargorent.dto.CarRequestDto;
import com.cargorent.dto.CarResponseDto;
import com.cargorent.entity.Company;
import com.cargorent.exception.ResourceNotFoundException;
import com.cargorent.repository.CompanyRepository;
import com.cargorent.security.UserPrincipal;
import com.cargorent.service.CarService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/company")
@org.springframework.security.access.prepost.PreAuthorize("hasRole('COMPANY')")
public class CompanyDashboardController {

    private final CarService carService;
    private final CompanyRepository companyRepository;

    public CompanyDashboardController(
            CarService carService,
            CompanyRepository companyRepository) {
        this.carService = carService;
        this.companyRepository = companyRepository;
    }

    // ✅ CORRECT WAY: Resolve company using USER ID from JWT
    private Company getAuthenticatedCompany() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !(authentication.getPrincipal() instanceof UserPrincipal)) {
            throw new ResourceNotFoundException("Unauthorized access");
        }

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        Long userId = principal.getUserId();

        return companyRepository.findByUser_Id(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Company profile not found"));
    }

    // ================= GET MY CARS =================
    @GetMapping("/cars")
    public ResponseEntity<List<CarResponseDto>> getMyCars() {
        Company company = getAuthenticatedCompany();
        return ResponseEntity.ok(carService.getCarsByCompany(company.getId()));
    }

    // ================= ADD CAR =================
    @PostMapping("/cars")
    public ResponseEntity<CarResponseDto> addCar(
            @Valid @RequestBody CarRequestDto carRequestDto) {
        Company company = getAuthenticatedCompany();
        try {
            // Allow adding cars even if inactive (visibility handled by query)
            CarResponseDto savedCar = carService.addCar(company.getId(), carRequestDto);
            return new ResponseEntity<>(savedCar, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace(); // Log the full stack trace
            throw e; // Re-throw to let global exception handler manage it, or return internal server
                     // error
        }
    }

    // ================= UPDATE CAR =================
    @PutMapping("/cars/{carId}")
    public ResponseEntity<CarResponseDto> updateCar(
            @PathVariable Long carId,
            @Valid @RequestBody CarRequestDto carRequestDto) {
        Company company = getAuthenticatedCompany();
        // Allow updating cars even if inactive
        return ResponseEntity.ok(
                carService.updateCar(company.getId(), carId, carRequestDto));
    }

    // ================= DELETE CAR =================
    @DeleteMapping("/cars/{carId}")
    public ResponseEntity<Void> deleteCar(@PathVariable Long carId) {
        Company company = getAuthenticatedCompany();
        // Allow deleting cars even if inactive
        carService.deleteCar(company.getId(), carId);
        return ResponseEntity.noContent().build();
    }
}