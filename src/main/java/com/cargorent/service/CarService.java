package com.cargorent.service;

import com.cargorent.dto.CarResponseDto;

import java.util.List;

public interface CarService {

    List<CarResponseDto> getCarsByCompany(Long companyId);
}