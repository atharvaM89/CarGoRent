package com.cargorent.controller;

import com.cargorent.dto.CarRequestDto;
import com.cargorent.dto.CarResponseDto;
import com.cargorent.security.UserPrincipal;
import com.cargorent.service.CarService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/member/cars")
@PreAuthorize("hasRole('MEMBER')")
public class MemberCarController {

    private final CarService carService;

    public MemberCarController(CarService carService) {
        this.carService = carService;
    }

    @GetMapping
    public ResponseEntity<List<CarResponseDto>> getMyCars(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(carService.getCarsByOwner(userPrincipal.getUserId()));
    }

    @PostMapping
    public ResponseEntity<CarResponseDto> addCar(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody CarRequestDto carRequestDto) {
        CarResponseDto savedCar = carService.addCarForMember(userPrincipal.getUserId(), carRequestDto);
        return new ResponseEntity<>(savedCar, HttpStatus.CREATED);
    }

    @DeleteMapping("/{carId}")
    public ResponseEntity<Void> deleteCar(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long carId) {
        carService.deleteCarForMember(userPrincipal.getUserId(), carId);
        return ResponseEntity.noContent().build();
    }
}
