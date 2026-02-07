package com.cargorent.controller;

import com.cargorent.dto.CarResponseDto;
import com.cargorent.service.CarService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/cars")
public class CarController {

    private final CarService carService;

    public CarController(CarService carService) {
        this.carService = carService;
    }

    @GetMapping("/public")
    public List<CarResponseDto> getAllCarsPublic() {
        return carService.getAllCarsForPublicDisplay();
    }

    @GetMapping("/company/{companyId}")
    public List<CarResponseDto> getCarsByCompany(@PathVariable Long companyId) {
        return carService.getCarsByCompany(companyId);
    }

    @GetMapping("/search")
    public List<CarResponseDto> searchCars(
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(value = "location", required = false) String location,
            @RequestParam(value = "carType", required = false) com.cargorent.entity.CarType carType,
            @RequestParam(value = "seatingCapacity", required = false) Integer seatingCapacity) {
        return carService.searchCars(startDate, endDate, location, carType, seatingCapacity);
    }

    @GetMapping("/{id}")
    public CarResponseDto getCarById(@PathVariable Long id) {
        return carService.getCarById(id);
    }
}