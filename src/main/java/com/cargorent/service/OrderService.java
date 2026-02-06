package com.cargorent.service;

import com.cargorent.dto.OrderResponseDto;
import com.cargorent.dto.PlaceOrderRequest;
import com.cargorent.entity.Order;

import java.util.List;

public interface OrderService {

    Order placeOrder(PlaceOrderRequest request);

    OrderResponseDto getOrderById(Long orderId);

    List<OrderResponseDto> getOrdersByCustomer(Long customerId);

    List<OrderResponseDto> getOrdersByCompany(Long companyId);

    OrderResponseDto cancelOrder(Long orderId, Long customerId);

    OrderResponseDto updateOrderStatus(Long orderId, String status);
}