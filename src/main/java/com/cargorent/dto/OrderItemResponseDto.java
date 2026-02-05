package com.cargorent.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class OrderItemResponseDto {

    private Long carId;
    private String carModel;
    private Integer numberOfDays;
    private Double price;
}