package com.cargorent.dto;

import lombok.Getter;

@Getter
public class OrderItemRequest {

    private Long carId;
    private Integer numberOfDays;
}