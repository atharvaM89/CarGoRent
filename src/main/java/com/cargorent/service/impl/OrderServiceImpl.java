package com.cargorent.service.impl;

import com.cargorent.dto.OrderItemRequest;
import com.cargorent.dto.OrderItemResponseDto;
import com.cargorent.dto.OrderResponseDto;
import com.cargorent.dto.PlaceOrderRequest;
import com.cargorent.entity.*;
import com.cargorent.repository.*;
import com.cargorent.service.OrderService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final CarRepository carRepository;

    public OrderServiceImpl(
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            UserRepository userRepository,
            CompanyRepository companyRepository,
            CarRepository carRepository
    ) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.carRepository = carRepository;
    }

    @Override
    @Transactional
    public Order placeOrder(PlaceOrderRequest request) {

        User customer = userRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Company company = companyRepository.findById(request.getCompanyId())
                .orElseThrow(() -> new RuntimeException("Company not found"));

        Order order = Order.builder()
                .customer(customer)
                .company(company)
                .status(OrderStatus.PLACED)
                .totalAmount(0.0)
                .build();

        Order savedOrder = orderRepository.save(order);

        double totalAmount = 0.0;
        List<OrderItem> orderItems = new ArrayList<>();

        for (OrderItemRequest itemRequest : request.getItems()) {

            Car car = carRepository.findById(itemRequest.getCarId())
                    .orElseThrow(() -> new RuntimeException("Car not found"));

            double price = car.getPricePerDay() * itemRequest.getNumberOfDays();
            totalAmount += price;

            OrderItem orderItem = OrderItem.builder()
                    .order(savedOrder)
                    .car(car)
                    .numberOfDays(itemRequest.getNumberOfDays())
                    .price(price)
                    .build();

            orderItems.add(orderItem);
        }

        orderItemRepository.saveAll(orderItems);

        savedOrder.setTotalAmount(totalAmount);
        savedOrder.setOrderItems(orderItems);

        return orderRepository.save(savedOrder);
    }
    @Override
    @Transactional(readOnly = true)
    public OrderResponseDto getOrderById(Long orderId) {

        Order order = orderRepository.findOrderWithDetails(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        return new OrderResponseDto(
                order.getId(),
                order.getTotalAmount(),
                order.getStatus().name(),
                order.getCreatedAt(),
                order.getCustomer().getId(),
                order.getCompany().getId(),
                order.getOrderItems().stream()
                        .map(item -> new OrderItemResponseDto(
                                item.getCar().getId(),
                                item.getCar().getModel(),
                                item.getNumberOfDays(),
                                item.getPrice()
                        ))
                        .toList()
        );
    }
}