package com.cargorent.service;

import com.cargorent.dto.RatingRequestDto;
import com.cargorent.dto.RatingResponseDto;

import java.util.List;

public interface RatingService {
    RatingResponseDto addRating(Long userId, RatingRequestDto request);

    List<RatingResponseDto> getRatingsByCar(Long carId);
}
