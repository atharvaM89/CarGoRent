package com.cargorent.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlaceOrderRequest {

    private Long customerId; // Optional, ignored by backend for security

    // @NotNull(message = "Company ID is required") - Made optional for Member cars
    // @Positive(message = "Company ID must be positive")
    private Long companyId;

    private Long ownerId; // New field for Member cars

    @NotEmpty(message = "Order must contain at least one item")
    @Valid
    private List<OrderItemRequest> items;
}