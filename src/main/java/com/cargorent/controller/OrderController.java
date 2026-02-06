package com.cargorent.controller;

import com.cargorent.dto.OrderResponseDto;
import com.cargorent.dto.PlaceOrderRequest;
import com.cargorent.entity.Order;
import com.cargorent.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // PLACE ORDER
    @PostMapping
    public ResponseEntity<Order> placeOrder(@RequestBody PlaceOrderRequest request) {
        Order order = orderService.placeOrder(request);
        return new ResponseEntity<>(order, HttpStatus.CREATED);
    }

    // GET ORDER DETAILS
    @GetMapping("/{orderId}")
    public OrderResponseDto getOrder(@PathVariable Long orderId) {
        return orderService.getOrderById(orderId);
    }

    // ORDER HISTORY
    @GetMapping("/customer/{customerId}")
    public List<OrderResponseDto> getOrdersByCustomer(@PathVariable Long customerId) {
        return orderService.getOrdersByCustomer(customerId);
    }

    // CANCEL ORDER (CUSTOMER)
    @PutMapping("/{orderId}/cancel")
    public OrderResponseDto cancelOrder(
            @PathVariable Long orderId,
            @RequestParam Long customerId
    ) {
        return orderService.cancelOrder(orderId, customerId);
    }

    // UPDATE ORDER STATUS (COMPANY)
    @PutMapping("/{orderId}/status")
    public OrderResponseDto updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam String status
    ) {
        return orderService.updateOrderStatus(orderId, status);
    }
}