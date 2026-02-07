package com.cargorent.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@AllArgsConstructor
public class OrderResponseDto {

    private Long orderId;
    private Double totalAmount;
    private String status;
    private LocalDateTime createdAt;

    private Long customerId;
    private Long companyId;
    private Long ownerId;

    private List<OrderItemResponseDto> items;
}