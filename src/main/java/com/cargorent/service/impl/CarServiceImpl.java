package com.cargorent.service.impl;

import com.cargorent.dto.CarResponseDto;
import com.cargorent.repository.CarRepository;
import com.cargorent.service.CarService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CarServiceImpl implements CarService {

    private final CarRepository carRepository;

    public CarServiceImpl(CarRepository carRepository) {
        this.carRepository = carRepository;
    }

    @Override
    public List<CarResponseDto> getCarsByCompany(Long companyId) {
        return carRepository.findCarsWithCompany(companyId)
                .stream()
                .map(car -> new CarResponseDto(
                        car.getId(),
                        car.getModel(),
                        car.getBrand(),
                        car.getPricePerDay(),
                        car.isAvailability(),
                        car.getCompany().getId(),
                        car.getCompany().getCompanyName()
                ))
                .toList();
    }
}