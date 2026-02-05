package com.cargorent.service;

import com.cargorent.dto.PlaceOrderRequest;
import com.cargorent.entity.Order;

public interface OrderService {

    Order placeOrder(PlaceOrderRequest request);
}