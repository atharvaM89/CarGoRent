package com.cargorent.service.impl;

import com.cargorent.dto.OrderItemResponseDto;
import com.cargorent.dto.OrderResponseDto;
import com.cargorent.service.InvoiceService;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
public class InvoiceServiceImpl implements InvoiceService {

    @Override
    public ByteArrayInputStream generateInvoice(OrderResponseDto order) {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Header
            Font fontHeader = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22);
            Paragraph title = new Paragraph("CarGoRent Invoice", fontHeader);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(Chunk.NEWLINE);

            // Order Details
            Font fontBody = FontFactory.getFont(FontFactory.HELVETICA, 12);
            document.add(new Paragraph("Order ID: " + order.getOrderId(), fontBody));
            document.add(new Paragraph("Date: " + order.getCreatedAt().toLocalDate(), fontBody));
            document.add(new Paragraph("Customer ID: " + order.getCustomerId(), fontBody));
            if (order.getCompanyId() != null) {
                document.add(new Paragraph("Company ID: " + order.getCompanyId(), fontBody));
            } else if (order.getOwnerId() != null) {
                document.add(new Paragraph("Owner ID: " + order.getOwnerId(), fontBody));
            }
            document.add(Chunk.NEWLINE);

            // Table
            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);
            table.setWidths(new int[] { 4, 4, 3, 3 });

            // Table Header
            Font fontTableHeader = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);
            table.addCell(new PdfPCell(new Phrase("Car Model", fontTableHeader)));
            table.addCell(new PdfPCell(new Phrase("Days", fontTableHeader)));
            table.addCell(new PdfPCell(new Phrase("Price Only", fontTableHeader))); // Just price concept
            table.addCell(new PdfPCell(new Phrase("Subtotal", fontTableHeader)));

            // Items
            if (order.getItems() != null) {
                for (OrderItemResponseDto item : order.getItems()) {
                    table.addCell(item.getCarModel());
                    table.addCell(String.valueOf(item.getNumberOfDays()));
                    // Calculate daily rate roughly if not present, but item.getPrice() is usually
                    // total for that item
                    // Assuming item.getPrice() is the total for that item line
                    double dailyRate = item.getPrice() / item.getNumberOfDays();
                    table.addCell(String.format("%.2f", dailyRate));
                    table.addCell(String.format("%.2f", item.getPrice()));
                }
            }

            document.add(table);
            document.add(Chunk.NEWLINE);

            // Total
            Font fontTotal = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16);
            Paragraph total = new Paragraph("Total Amount: ₹" + order.getTotalAmount(), fontTotal);
            total.setAlignment(Element.ALIGN_RIGHT);
            document.add(total);

            // Footer
            document.add(Chunk.NEWLINE);
            document.add(Chunk.NEWLINE);
            Paragraph footer = new Paragraph("Thank you for choosing CarGoRent!", fontBody);
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();

        } catch (DocumentException e) {
            e.printStackTrace();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }
}
