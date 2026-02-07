package com.cargorent.service;

import com.cargorent.dto.OrderResponseDto;

import java.io.ByteArrayInputStream;

public interface InvoiceService {
    ByteArrayInputStream generateInvoice(OrderResponseDto order);
}
