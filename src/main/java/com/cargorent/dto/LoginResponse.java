package com.cargorent.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class LoginResponse {

    private String token;
    private String role;
    private Long userId;
    private Long companyId;
    @JsonProperty("isCompanyActive")
    private boolean isCompanyActive;

    public LoginResponse(String token, String role, Long userId, Long companyId, boolean isCompanyActive) {
        this.token = token;
        this.role = role;
        this.userId = userId;
        this.companyId = companyId;
        this.isCompanyActive = isCompanyActive;
    }

    public String getToken() {
        return token;
    }

    public String getRole() {
        return role;
    }

    public Long getUserId() {
        return userId;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public boolean isCompanyActive() {
        return isCompanyActive;
    }
}