import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await api.get('/auth/me');
                    // response.data should have { role, userId, companyId }
                    const { role, userId, companyId, isCompanyActive, companyActive } = response.data;
                    setUser({ token, role, id: userId, companyId, isCompanyActive: isCompanyActive ?? companyActive });
                } catch (error) {
                    console.error("Session restoration failed", error);
                    localStorage.removeItem('token');
                    setUser(null);
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, role, userId, companyId, isCompanyActive, companyActive } = response.data;
            localStorage.setItem('token', token);
            setUser({ token, role, id: userId, companyId, isCompanyActive: isCompanyActive ?? companyActive });
            return response.data;
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const register = async (userData) => {
        try {
            const response = await api.post('/users/register', userData);
            return response.data;
        } catch (error) {
            console.error("Registration failed", error);
            throw error;
        }
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
