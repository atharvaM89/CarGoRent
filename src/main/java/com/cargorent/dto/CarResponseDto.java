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
    private boolean isActive;
    private String url;
    private Long companyId;
    private String companyName;
    private String location;
    private com.cargorent.entity.CarType carType;
    private int seatingCapacity;
    private String description;
    private Long ownerId;
    private String ownerName;
    private Double averageRating;
    private String companyType;
}