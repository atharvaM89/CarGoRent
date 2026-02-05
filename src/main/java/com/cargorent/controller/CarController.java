package com.cargorent.controller;

import com.cargorent.dto.CarResponseDto;
import com.cargorent.service.CarService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cars")
public class CarController {

    private final CarService carService;

    public CarController(CarService carService) {
        this.carService = carService;
    }

    @GetMapping("/company/{companyId}")
    public List<CarResponseDto> getCarsByCompany(@PathVariable Long companyId) {
        return carService.getCarsByCompany(companyId);
    }
}