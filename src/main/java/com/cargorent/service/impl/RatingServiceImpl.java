package com.cargorent.service.impl;

import com.cargorent.dto.RatingRequestDto;
import com.cargorent.dto.RatingResponseDto;
import com.cargorent.entity.Car;
import com.cargorent.entity.Order;
import com.cargorent.entity.OrderStatus;
import com.cargorent.entity.Rating;
import com.cargorent.entity.User;
import com.cargorent.exception.BadRequestException;
import com.cargorent.exception.ResourceNotFoundException;
import com.cargorent.repository.CarRepository;
import com.cargorent.repository.OrderRepository;
import com.cargorent.repository.RatingRepository;
import com.cargorent.repository.UserRepository;
import com.cargorent.service.RatingService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RatingServiceImpl implements RatingService {

    private final RatingRepository ratingRepository;
    private final OrderRepository orderRepository;
    private final CarRepository carRepository;
    private final UserRepository userRepository;

    public RatingServiceImpl(
            RatingRepository ratingRepository,
            OrderRepository orderRepository,
            CarRepository carRepository,
            UserRepository userRepository) {
        this.ratingRepository = ratingRepository;
        this.orderRepository = orderRepository;
        this.carRepository = carRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public RatingResponseDto addRating(Long userId, RatingRequestDto request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!order.getCustomer().getId().equals(userId)) {
            throw new BadRequestException("You can only rate your own orders");
        }

        if (order.getStatus() != OrderStatus.COMPLETED) {
            throw new BadRequestException("You can only rate completed orders");
        }

        if (ratingRepository.existsByOrderIdAndCarId(order.getId(), request.getCarId())) {
            throw new BadRequestException("This car has already been rated for this order");
        }

        Car car = carRepository.findById(request.getCarId())
                .orElseThrow(() -> new ResourceNotFoundException("Car not found"));

        // Verify car is part of order (Basic check, or check items)
        boolean carInOrder = order.getOrderItems().stream()
                .anyMatch(item -> item.getCar().getId().equals(car.getId()));

        if (!carInOrder) {
            throw new BadRequestException("Car is not part of this order");
        }

        Rating rating = Rating.builder()
                .user(user)
                .car(car)
                .order(order)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        Rating savedRating = ratingRepository.save(rating);

        return mapToDto(savedRating);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RatingResponseDto> getRatingsByCar(Long carId) {
        return ratingRepository.findByCarId(carId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private RatingResponseDto mapToDto(Rating rating) {
        return new RatingResponseDto(
                rating.getId(),
                rating.getCar().getId(),
                rating.getOrder().getId(),
                rating.getUser().getId(),
                rating.getUser().getName(),
                rating.getRating(),
                rating.getComment(),
                rating.getCreatedAt());
    }
}
