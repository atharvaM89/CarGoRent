package com.cargorent.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;

@Component
public class DatabaseFixer implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    public DatabaseFixer(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("🔧 Executing Database Schema Fixes...");

        // FIX 1: Make company_id nullable
        try {
            jdbcTemplate.execute("ALTER TABLE cars MODIFY company_id BIGINT NULL");
            System.out.println("✅ Successfully modified cars.company_id to be NULLABLE");
        } catch (Exception e) {
            System.out.println("⚠️ Error modifying cars.company_id: " + e.getMessage());
        }

        // FIX 2: Make owner_id nullable
        try {
            jdbcTemplate.execute("ALTER TABLE cars MODIFY owner_id BIGINT NULL");
            System.out.println("✅ Successfully modified cars.owner_id to be NULLABLE");
        } catch (Exception e) {
            System.out.println("⚠️ Error modifying cars.owner_id: " + e.getMessage());
        }

        // FIX 3: Backfill company_type
        try {
            int updated = jdbcTemplate
                    .update("UPDATE companies SET company_type = 'NORMAL' WHERE company_type IS NULL");
            if (updated > 0) {
                System.out.println("✅ Backfilled " + updated + " companies with NULL company_type");
            }
        } catch (Exception e) {
            System.out.println("⚠️ Error backfilling company_type: " + e.getMessage());
        }

        System.out.println("🔧 Database Schema Fixes Completed.");
    }
}
