package com.cargorent.dto;

import lombok.Getter;

import java.util.List;

@Getter
public class PlaceOrderRequest {

    private Long customerId;
    private Long companyId;
    private List<OrderItemRequest> items;
}