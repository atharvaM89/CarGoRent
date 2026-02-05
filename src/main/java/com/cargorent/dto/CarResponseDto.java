package com.cargorent.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CarResponseDto {

    private Long id;
    private String model;
    private String brand;
    private Double pricePerDay;
    private boolean availability;

    private Long companyId;
    private String companyName;
}