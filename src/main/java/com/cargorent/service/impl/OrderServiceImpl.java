package com.cargorent.service.impl;

import com.cargorent.dto.OrderItemRequest;
import com.cargorent.dto.OrderResponseDto;
import com.cargorent.dto.PlaceOrderRequest;
import com.cargorent.entity.*;
import com.cargorent.exception.BadRequestException;
import com.cargorent.exception.ResourceNotFoundException;
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

    // ================= PLACE ORDER =================
    @Override
    @Transactional
    public Order placeOrder(PlaceOrderRequest request) {

        User customer = userRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        if (customer.getRole() != Role.CUSTOMER) {
            throw new BadRequestException("Only customers can place orders");
        }

        Company company = companyRepository.findById(request.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));

        Order order = Order.builder()
                .customer(customer)
                .company(company)
                .status(OrderStatus.PLACED)
                .totalAmount(0.0)
                .build();

        orderRepository.save(order);

        double totalAmount = 0.0;
        List<OrderItem> orderItems = new ArrayList<>();

        for (OrderItemRequest itemRequest : request.getItems()) {

            Car car = carRepository.findById(itemRequest.getCarId())
                    .orElseThrow(() -> new ResourceNotFoundException("Car not found"));

            if (!car.getCompany().getId().equals(company.getId())) {
                throw new BadRequestException("Car does not belong to selected company");
            }

            if (!car.isAvailability()) {
                throw new BadRequestException("Car is already booked");
            }

            if (itemRequest.getNumberOfDays() <= 0) {
                throw new BadRequestException("Number of days must be greater than zero");
            }

            double price = car.getPricePerDay() * itemRequest.getNumberOfDays();
            totalAmount += price;

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .car(car)
                    .numberOfDays(itemRequest.getNumberOfDays())
                    .price(price)
                    .build();

            orderItems.add(orderItem);

            car.setAvailability(false);
            carRepository.save(car);
        }

        orderItemRepository.saveAll(orderItems);

        order.setTotalAmount(totalAmount);
        order.setOrderItems(orderItems);

        return orderRepository.save(order);
    }

    // ================= CANCEL ORDER (CUSTOMER) =================
    @Override
    @Transactional
    public OrderResponseDto cancelOrder(Long orderId, Long customerId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!order.getCustomer().getId().equals(customerId)) {
            throw new BadRequestException("You can cancel only your own orders");
        }

        if (order.getStatus() != OrderStatus.PLACED) {
            throw new BadRequestException("Order cannot be cancelled at this stage");
        }

        order.setStatus(OrderStatus.CANCELLED);

        // Restore car availability
        order.getOrderItems().forEach(item -> {
            Car car = item.getCar();
            car.setAvailability(true);
            carRepository.save(car);
        });

        orderRepository.save(order);

        return new OrderResponseDto(
                order.getId(),
                order.getTotalAmount(),
                order.getStatus().name(),
                order.getCreatedAt(),
                order.getCustomer().getId(),
                order.getCompany().getId(),
                List.of()
        );
    }

    // ================= UPDATE ORDER STATUS (COMPANY) =================
    @Override
    @Transactional
    public OrderResponseDto updateOrderStatus(Long orderId, String status) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        OrderStatus newStatus;

        try {
            newStatus = OrderStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid order status");
        }

        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new BadRequestException("Cancelled order cannot be updated");
        }

        if (order.getStatus() == OrderStatus.PLACED && newStatus != OrderStatus.CONFIRMED) {
            throw new BadRequestException("Order must be CONFIRMED first");
        }

        if (order.getStatus() == OrderStatus.CONFIRMED && newStatus != OrderStatus.COMPLETED) {
            throw new BadRequestException("Order must be COMPLETED after confirmation");
        }

        order.setStatus(newStatus);
        orderRepository.save(order);

        return new OrderResponseDto(
                order.getId(),
                order.getTotalAmount(),
                order.getStatus().name(),
                order.getCreatedAt(),
                order.getCustomer().getId(),
                order.getCompany().getId(),
                List.of()
        );
    }

    // ================= ORDER DETAILS =================
    @Override
    @Transactional(readOnly = true)
    public OrderResponseDto getOrderById(Long orderId) {

        Order order = orderRepository.findOrderWithDetails(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        return new OrderResponseDto(
                order.getId(),
                order.getTotalAmount(),
                order.getStatus().name(),
                order.getCreatedAt(),
                order.getCustomer().getId(),
                order.getCompany().getId(),
                order.getOrderItems().stream()
                        .map(item -> new com.cargorent.dto.OrderItemResponseDto(
                                item.getCar().getId(),
                                item.getCar().getModel(),
                                item.getNumberOfDays(),
                                item.getPrice()
                        ))
                        .toList()
        );
    }

    // ================= ORDER HISTORY =================
    @Override
    @Transactional(readOnly = true)
    public List<OrderResponseDto> getOrdersByCustomer(Long customerId) {

        return orderRepository.findOrdersByCustomer(customerId)
                .stream()
                .map(order -> new OrderResponseDto(
                        order.getId(),
                        order.getTotalAmount(),
                        order.getStatus().name(),
                        order.getCreatedAt(),
                        order.getCustomer().getId(),
                        order.getCompany().getId(),
                        List.of()
                ))
                .toList();
    }
}