package com.cargorent.controller;

import com.cargorent.dto.OrderResponseDto;
import com.cargorent.dto.PlaceOrderRequest;
import com.cargorent.entity.Order;
import com.cargorent.security.UserPrincipal;
import com.cargorent.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // ================= PLACE ORDER =================
    @PostMapping
    public ResponseEntity<Order> placeOrder(@RequestBody PlaceOrderRequest request) {
        Order order = orderService.placeOrder(request);
        return new ResponseEntity<>(order, HttpStatus.CREATED);
    }

    // ================= GET MY ORDERS (JWT BASED) =================
    @GetMapping("/my")
    public List<OrderResponseDto> getMyOrders() {

        UserPrincipal principal =
                (UserPrincipal) SecurityContextHolder.getContext()
                        .getAuthentication()
                        .getPrincipal();

        Long userId = principal.getUserId();

        return orderService.getOrdersByCustomer(userId);
    }

    // ================= ORDER DETAILS =================
    @GetMapping("/{orderId}")
    public OrderResponseDto getOrder(@PathVariable Long orderId) {
        return orderService.getOrderById(orderId);
    }

    // ================= CANCEL ORDER =================
    @PutMapping("/{orderId}/cancel")
    public OrderResponseDto cancelOrder(@PathVariable Long orderId) {

        UserPrincipal principal =
                (UserPrincipal) SecurityContextHolder.getContext()
                        .getAuthentication()
                        .getPrincipal();

        Long userId = principal.getUserId();

        return orderService.cancelOrder(orderId, userId);
    }

    // ================= UPDATE STATUS (COMPANY) =================
    @PutMapping("/{orderId}/status")
    public OrderResponseDto updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam String status
    ) {
        return orderService.updateOrderStatus(orderId, status);
    }
}