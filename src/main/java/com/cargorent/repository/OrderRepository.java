package com.cargorent.repository;

import com.cargorent.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query("""
        select distinct o from Order o
        join fetch o.orderItems oi
        join fetch oi.car
        join fetch o.customer
        join fetch o.company
        where o.id = :orderId
    """)
    Optional<Order> findOrderWithDetails(Long orderId);

    @Query("""
        select o from Order o
        where o.customer.id = :customerId
        order by o.createdAt desc
    """)
    List<Order> findOrdersByCustomer(Long customerId);
}