package com.cargorent.repository;

import com.cargorent.entity.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CarRepository extends JpaRepository<Car, Long> {

    @Query("""
        select c from Car c
        join fetch c.company
        where c.company.id = :companyId
    """)
    List<Car> findCarsWithCompany(Long companyId);
}