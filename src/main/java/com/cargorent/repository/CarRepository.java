package com.cargorent.repository;

import com.cargorent.entity.Car;
import org.springframework.data.jpa.repository.Lock;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CarRepository extends JpaRepository<Car, Long> {

    @Query("SELECT c FROM Car c WHERE c.company.id = :companyId AND c.isActive = true")
    List<Car> findCarsWithCompany(@Param("companyId") Long companyId);

    List<Car> findByOwner_IdAndIsActiveTrue(Long ownerId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT c FROM Car c WHERE c.id = :id")
    java.util.Optional<Car> findByIdWithLock(@Param("id") Long id);

    @Query("""
                SELECT CASE WHEN COUNT(oi) > 0 THEN true ELSE false END
                FROM OrderItem oi
                JOIN oi.order o
                WHERE oi.car.id = :carId
                AND o.status IN ('PLACED', 'CONFIRMED', 'ACTIVE')
                AND (
                    (oi.startDate <= :endDate AND oi.endDate >= :startDate)
                )
            """)
    boolean existsOverlappingBookings(Long carId, java.time.LocalDate startDate, java.time.LocalDate endDate);

    @Query("""
                SELECT c FROM Car c
                LEFT JOIN FETCH c.company co
                LEFT JOIN FETCH c.owner ow
                WHERE c.isActive = true
                AND (co IS NULL OR co.isActive = true)
                AND (:location IS NULL OR LOWER(c.location) LIKE LOWER(CONCAT('%', :location, '%')))
                AND (:carType IS NULL OR c.carType = :carType)
                AND (:seatingCapacity IS NULL OR c.seatingCapacity >= :seatingCapacity)
                AND c NOT IN (
                    SELECT oi.car FROM OrderItem oi
                    JOIN oi.order o
                    WHERE o.status IN ('PLACED', 'CONFIRMED', 'ACTIVE')
                    AND (oi.startDate <= :endDate AND oi.endDate >= :startDate)
                )
            """)
    List<Car> findAvailableCars(
            java.time.LocalDate startDate,
            java.time.LocalDate endDate,
            String location,
            com.cargorent.entity.CarType carType,
            Integer seatingCapacity);

    @Query("""
            SELECT DISTINCT c FROM Car c
            LEFT JOIN FETCH c.company co
            LEFT JOIN FETCH c.owner ow
            WHERE c.isActive = true
            AND (co IS NULL OR co.isActive = true)
            ORDER BY c.id DESC
            """)
    List<Car> findAllActiveForPublicDisplay();
}