import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const api = axios.create({
        baseURL: 'http://localhost:5000/api',
        withCredentials: true
    });

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            const response = await api.get('/user/me');
            if (response.data.success) {
                setUser(response.data.user);
            }
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const response = await api.post('/user/login', { email, password });
        if (response.data.success) {
            await checkUser();
        }
        return response.data;
    };

    const register = async (name, email, password, role) => {
        const response = await api.post('/user/register', { name, email, password, role });
        return response.data;
    };

    const verifyOTP = async (email, otp) => {
        const response = await api.post('/user/verify-otp', { email, otp });
        return response.data;
    };

    const logout = async () => {
        await api.post('/user/logout');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, verifyOTP, logout, api }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
