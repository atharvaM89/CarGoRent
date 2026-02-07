package com.cargorent.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CarRequestDto {

    @NotBlank(message = "Brand is required")
    private String brand;

    @NotBlank(message = "Model is required")
    private String model;

    @NotNull(message = "Price per day is required")
    @Min(value = 0, message = "Price must be positive")
    private Double pricePerDay;

    private String imageUrl; // Optional, can be null

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Car Type is required")
    private com.cargorent.entity.CarType carType;

    @Min(value = 1, message = "Seating capacity must be at least 1")
    private int seatingCapacity;

    @NotBlank(message = "Description is required")
    private String description;
}
