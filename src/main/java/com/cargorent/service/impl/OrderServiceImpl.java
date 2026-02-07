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
    private final RatingRepository ratingRepository;

    public OrderServiceImpl(
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            UserRepository userRepository,
            CompanyRepository companyRepository,
            CarRepository carRepository,
            RatingRepository ratingRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.carRepository = carRepository;
        this.ratingRepository = ratingRepository;
    }
    // ... (Constructor is actually at top, I need to match carefully or use
    // separate ReplaceChunk)

    // ...

    // ================= PLACE ORDER =================
    @Override
    @Transactional
    public Order placeOrder(PlaceOrderRequest request, Long customerId) {

        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        if (customer.getRole() != Role.CUSTOMER) {
            throw new BadRequestException("Only customers can place orders");
        }

        Company company = null;
        User owner = null;

        if (request.getCompanyId() != null) {
            company = companyRepository.findById(request.getCompanyId())
                    .orElseThrow(() -> new ResourceNotFoundException("Company not found"));
        } else if (request.getOwnerId() != null) {
            owner = userRepository.findById(request.getOwnerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));
        } else {
            throw new BadRequestException("Either Company ID or Owner ID must be provided");
        }

        Order order = Order.builder()
                .customer(customer)
                .company(company)
                .owner(owner)
                .status(OrderStatus.PLACED)
                .totalAmount(0.0)
                .build();

        orderRepository.save(order);

        double totalAmount = 0.0;
        List<OrderItem> orderItems = new ArrayList<>();

        for (OrderItemRequest itemRequest : request.getItems()) {

            // Use Lock for strict availability check
            Car car = carRepository.findByIdWithLock(itemRequest.getCarId())
                    .orElseThrow(() -> new ResourceNotFoundException("Car not found"));

            // Validation: Car must belong to the selected Company OR Owner
            if (company != null) {
                if (car.getCompany() == null || !car.getCompany().getId().equals(company.getId())) {
                    throw new BadRequestException("Car " + car.getModel() + " does not belong to the selected company");
                }
            } else {
                // Member Car validation
                if (car.getOwner() == null || !car.getOwner().getId().equals(request.getOwnerId())) {
                    throw new BadRequestException("Car " + car.getModel() + " does not belong to the selected owner");
                }
            }

            // Date Validation
            if (itemRequest.getStartDate().isAfter(itemRequest.getEndDate())) {
                throw new BadRequestException("Start date must be before or equal to end date");
            }

            if (itemRequest.getStartDate().isBefore(java.time.LocalDate.now())) {
                throw new BadRequestException("Cannot book in the past");
            }

            // Overlap Validation
            boolean hasOverlap = carRepository.existsOverlappingBookings(
                    car.getId(), itemRequest.getStartDate(), itemRequest.getEndDate());

            if (hasOverlap) {
                throw new BadRequestException(
                        "Car " + car.getModel() + " is already booked for the selected dates");
            }

            // Calculate days (Inclusive)
            long days = java.time.temporal.ChronoUnit.DAYS.between(
                    itemRequest.getStartDate(), itemRequest.getEndDate()) + 1;

            if (days <= 0)
                days = 1;

            double price = car.getPricePerDay() * days;
            totalAmount += price;

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .car(car)
                    .startDate(itemRequest.getStartDate())
                    .endDate(itemRequest.getEndDate())
                    .numberOfDays((int) days)
                    .price(price)
                    .build();

            orderItems.add(orderItem);
        }

        orderItemRepository.saveAll(orderItems);

        order.setTotalAmount(totalAmount);
        order.setOrderItems(orderItems);

        return orderRepository.save(order);
    }

    // ================= COMPANY DASHBOARD =================
    @Override
    @Transactional(readOnly = true)
    public List<OrderResponseDto> getOrdersByCompany(Long companyId) {
        return mapToOrderResponse(orderRepository.findOrdersByCompany(companyId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponseDto> getOrdersByCompanyUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Company company = companyRepository.findByUser(user)
                .orElseThrow(() -> new BadRequestException("User does not have a company profile"));

        return mapToOrderResponse(orderRepository.findOrdersByCompany(company.getId()));
    }

    private List<OrderResponseDto> mapToOrderResponse(List<Order> orders) {
        return orders.stream()
                .map(order -> new OrderResponseDto(
                        order.getId(),
                        order.getTotalAmount(),
                        order.getStatus().name(),
                        order.getCreatedAt(),
                        order.getCustomer().getId(),
                        order.getCompany() != null ? order.getCompany().getId() : null,
                        order.getOwner() != null ? order.getOwner().getId() : null,
                        List.of())) // Items could be populated if needed, keeping light for list
                .toList();
    }

    // ================= CANCEL ORDER =================
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
                order.getCompany() != null ? order.getCompany().getId() : null,
                order.getOwner() != null ? order.getOwner().getId() : null,
                List.of());
    }

    // ================= UPDATE ORDER STATUS =================
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
                order.getCompany() != null ? order.getCompany().getId() : null,
                order.getOwner() != null ? order.getOwner().getId() : null,
                List.of());
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
                order.getCompany() != null ? order.getCompany().getId() : null,
                order.getOwner() != null ? order.getOwner().getId() : null,
                order.getOrderItems().stream()
                        .map(item -> new com.cargorent.dto.OrderItemResponseDto(
                                item.getCar().getId(),
                                item.getCar().getModel(),
                                item.getNumberOfDays(),
                                item.getPrice(),
                                ratingRepository.existsByOrderIdAndCarId(order.getId(), item.getCar().getId())))
                        .toList());
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
                        order.getCompany() != null ? order.getCompany().getId() : null,
                        order.getOwner() != null ? order.getOwner().getId() : null,
                        List.of()))
                .toList();
    }
}