package com.cargorent.service.impl;

import com.cargorent.dto.CarRequestDto;
import com.cargorent.dto.CarResponseDto;
import com.cargorent.entity.Car;
import com.cargorent.entity.Company;
import com.cargorent.exception.BadRequestException;
import com.cargorent.exception.ResourceNotFoundException;
import com.cargorent.repository.CarRepository;
import com.cargorent.repository.CompanyRepository;
import com.cargorent.service.CarService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@org.springframework.transaction.annotation.Transactional
public class CarServiceImpl implements CarService {

    private final CarRepository carRepository;
    private final CompanyRepository companyRepository;
    private final com.cargorent.repository.UserRepository userRepository;

    public CarServiceImpl(CarRepository carRepository, CompanyRepository companyRepository,
            com.cargorent.repository.UserRepository userRepository) {
        this.carRepository = carRepository;
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<CarResponseDto> getCarsByCompany(Long companyId) {
        return carRepository.findCarsWithCompany(companyId)
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    @Override
    public List<CarResponseDto> getCarsByOwner(Long userId) {
        return carRepository.findByOwner_IdAndIsActiveTrue(userId)
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    @Override
    public CarResponseDto addCar(Long companyId, CarRequestDto dto) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));

        Car car = buildCarFromDto(dto);
        car.setCompany(company);
        car.setOwner(null); // Explicitly set owner to null

        validateCarOwnership(car);

        System.out.println("Saving Car: CompanyID=" + companyId + ", OwnerID="
                + (car.getOwner() != null ? car.getOwner().getId() : "null"));
        try {
            Car savedCar = carRepository.save(car);
            return mapToDto(savedCar);
        } catch (Exception e) {
            e.printStackTrace();
            throw new BadRequestException("Failed to save car: " + e.getMessage());
        }
    }

    @Override
    public CarResponseDto addCarForMember(Long userId, CarRequestDto dto) {
        com.cargorent.entity.User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() != com.cargorent.entity.Role.MEMBER && user.getRole() != com.cargorent.entity.Role.ADMIN) {
            // Depending on requirements, maybe only MEMBER can add personal cars
        }

        // Fetch System Company "Members Fleet"
        Company membersFleet = companyRepository.findByCompanyType(com.cargorent.entity.CompanyType.SYSTEM)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "System Company 'Members Fleet' not found. Please restart application to initialize data."));

        Car car = buildCarFromDto(dto);
        car.setOwner(user);
        car.setCompany(membersFleet); // Link to System Company

        validateCarOwnership(car);

        Car savedCar = carRepository.save(car);
        return mapToDto(savedCar);
    }

    private void validateCarOwnership(Car car) {
        com.cargorent.entity.CompanyType type = car.getCompany() != null ? car.getCompany().getCompanyType() : null;
        if (type == null && car.getCompany() != null) {
            type = com.cargorent.entity.CompanyType.NORMAL; // Default to NORMAL if null/missing
        }

        // Case 1: Standard Company Car
        if (car.getCompany() != null && type == com.cargorent.entity.CompanyType.NORMAL
                && car.getOwner() == null) {
            return;
        }

        // Case 2: Member Car (Must belong to System Company)
        if (car.getCompany() != null && type == com.cargorent.entity.CompanyType.SYSTEM
                && car.getOwner() != null) {
            return;
        }

        throw new BadRequestException(
                "Invalid Car Ownership. Must be either a Company car or a Member car linked to Members Fleet.");
    }

    private Car buildCarFromDto(CarRequestDto dto) {
        return Car.builder()
                .brand(dto.getBrand())
                .model(dto.getModel())
                .pricePerDay(dto.getPricePerDay())
                .location(dto.getLocation())
                .carType(dto.getCarType())
                .seatingCapacity(dto.getSeatingCapacity())
                .description(dto.getDescription())
                .availability(true)
                .isActive(true)
                .imageUrl(dto.getImageUrl())
                // company/owner set by caller
                .build();
    }

    @Override
    public CarResponseDto updateCar(Long companyId, Long carId, CarRequestDto dto) {
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new ResourceNotFoundException("Car not found"));

        if (!car.getCompany().getId().equals(companyId)) {
            throw new BadRequestException("Car does not belong to this company");
        }

        car.setBrand(dto.getBrand());
        car.setModel(dto.getModel());
        car.setPricePerDay(dto.getPricePerDay());

        // Update new fields
        car.setLocation(dto.getLocation());
        car.setCarType(dto.getCarType());
        car.setSeatingCapacity(dto.getSeatingCapacity());
        car.setDescription(dto.getDescription());

        if (dto.getImageUrl() != null) {
            car.setImageUrl(dto.getImageUrl());
        }

        Car updatedCar = carRepository.save(car);
        return mapToDto(updatedCar);
    }

    @Override
    public void deleteCar(Long companyId, Long carId) {
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new ResourceNotFoundException("Car not found"));

        if (!car.getCompany().getId().equals(companyId)) {
            throw new BadRequestException("Car does not belong to this company");
        }

        // Soft delete
        car.setActive(false);
        carRepository.save(car);
    }

    @Override
    public void deleteCarForMember(Long userId, Long carId) {
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new ResourceNotFoundException("Car not found"));

        if (!car.getOwner().getId().equals(userId)) {
            throw new BadRequestException("Car does not belong to you");
        }

        // Soft delete
        car.setActive(false);
        carRepository.save(car);
    }

    private CarResponseDto mapToDto(Car car) {
        return new CarResponseDto(
                car.getId(),
                car.getModel(),
                car.getBrand(),
                car.getPricePerDay(),
                car.isAvailability(),
                car.isActive(),
                car.getImageUrl(),
                car.getCompany() != null ? car.getCompany().getId() : null,
                car.getCompany() != null ? car.getCompany().getCompanyName() : null,
                car.getLocation(),
                car.getCarType(),
                car.getSeatingCapacity(),
                car.getDescription(),
                car.getOwner() != null ? car.getOwner().getId() : null,
                car.getOwner() != null ? car.getOwner().getName() : null,
                car.getAverageRating() != null ? Math.round(car.getAverageRating() * 10.0) / 10.0 : 0.0,
                car.getCompany() != null ? car.getCompany().getCompanyType().name() : null);
    }

    @Override
    public List<CarResponseDto> searchCars(
            java.time.LocalDate startDate,
            java.time.LocalDate endDate,
            String location,
            com.cargorent.entity.CarType carType,
            Integer seatingCapacity) {

        return carRepository.findAvailableCars(startDate, endDate, location, carType, seatingCapacity)
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    @Override
    public CarResponseDto getCarById(Long carId) {
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new ResourceNotFoundException("Car not found"));
        return mapToDto(car);
    }

    @Override
    public List<CarResponseDto> getAllCarsForPublicDisplay() {
        return carRepository.findAllActiveForPublicDisplay()
                .stream()
                .map(this::mapToDto)
                .toList();
    }
}