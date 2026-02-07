package com.cargorent.controller;

import com.cargorent.dto.RatingRequestDto;
import com.cargorent.dto.RatingResponseDto;
import com.cargorent.security.UserPrincipal;
import com.cargorent.service.RatingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @PostMapping
    public ResponseEntity<RatingResponseDto> addRating(@Valid @RequestBody RatingRequestDto request) {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();

        RatingResponseDto rating = ratingService.addRating(principal.getUserId(), request);
        return new ResponseEntity<>(rating, HttpStatus.CREATED);
    }

    @GetMapping("/car/{carId}")
    public ResponseEntity<List<RatingResponseDto>> getRatingsByCar(@PathVariable Long carId) {
        return ResponseEntity.ok(ratingService.getRatingsByCar(carId));
    }
}
