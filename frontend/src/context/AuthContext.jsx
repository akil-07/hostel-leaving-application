import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        console.log('Login called:', { email, password });
        try {
            // Google Apps Script Web App URL (all requests go here)
            // We use standard fetch or axios. 
            // Note: with axios + GAS, sometimes 'text/plain' header avoids CORS preflight issues if the script is simple.
            // But let's try standard JSON first. If it fails, we switch to fetch with no-cors (but we need response).
            // Actually, for GAS Web App 'AnyOne' access, standard POST works if the script returns correctly.

            const res = await axios.post(API_URL, {
                action: 'login',
                email,
                password
            });

            if (res.data.status === 'success') {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                setUser(res.data.user);
                toast.success('Login successful!');
                return res.data.user;
            } else {
                toast.error(res.data.message || 'Login failed');
                return null;
            }
        } catch (error) {
            console.error('Login Error:', error);
            toast.error('Login failed');
            return null;
        }
    };

    const register = async (name, email, password, role) => {
        try {
            const res = await axios.post(API_URL, {
                action: 'register',
                name,
                email,
                password,
                role
            });

            if (res.data.status === 'success') {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                setUser(res.data.user);
                toast.success('Registration successful!');
                return res.data.user;
            } else {
                toast.error(res.data.message || 'Registration failed');
                return null;
            }
        } catch (error) {
            console.error('Registration Error:', error);
            toast.error('Registration failed');
            return null;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        toast.success('Logged out');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
