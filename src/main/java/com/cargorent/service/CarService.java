package com.cargorent.service;

import com.cargorent.dto.CarResponseDto;

import java.util.List;

public interface CarService {

    List<CarResponseDto> getCarsByCompany(Long companyId);

    List<CarResponseDto> getCarsByOwner(Long userId);

    CarResponseDto addCar(Long companyId, com.cargorent.dto.CarRequestDto carRequestDto);

    CarResponseDto addCarForMember(Long userId, com.cargorent.dto.CarRequestDto carRequestDto);

    CarResponseDto updateCar(Long companyId, Long carId, com.cargorent.dto.CarRequestDto carRequestDto);

    void deleteCar(Long companyId, Long carId);

    List<CarResponseDto> searchCars(
            java.time.LocalDate startDate,
            java.time.LocalDate endDate,
            String location,
            com.cargorent.entity.CarType carType,
            Integer seatingCapacity);

    void deleteCarForMember(Long userId, Long carId);

    CarResponseDto getCarById(Long carId);

    List<CarResponseDto> getAllCarsForPublicDisplay();
}