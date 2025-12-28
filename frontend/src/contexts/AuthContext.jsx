import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// API Base URL for Spring Boot backend
const API_BASE_URL = 'http://localhost:8080/api/v1';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for saved session
        const savedToken = localStorage.getItem('hirfa-token');
        const savedUser = localStorage.getItem('hirfa-user');

        if (savedToken && savedUser) {
            setToken(savedToken);
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                // Invalid JSON, clear storage
                localStorage.removeItem('hirfa-token');
                localStorage.removeItem('hirfa-user');
            }
        }
        setLoading(false);
    }, []);

    // POST /api/v1/auth/authenticate
    const login = async (phoneNumber) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/authenticate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ phoneNumber })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Authentication failed');
            }

            // The response should contain a token
            const authToken = data.token;

            if (authToken) {
                setToken(authToken);
                localStorage.setItem('hirfa-token', authToken);

                // Decode JWT to get user info (basic decode without verification)
                // In production, you might want to call a /me endpoint
                const userPayload = parseJwt(authToken);

                const userData = {
                    id: userPayload?.sub || userPayload?.id,
                    phoneNumber: phoneNumber,
                    fullName: userPayload?.fullName || 'User',
                    role: userPayload?.role || 'CUSTOMER',
                    fairnessScore: userPayload?.fairnessScore || 100,
                    badges: userPayload?.badges || [],
                    verified: userPayload?.verified || false
                };

                setUser(userData);
                localStorage.setItem('hirfa-user', JSON.stringify(userData));

                return { success: true, user: userData, token: authToken };
            }

            throw new Error('No token received');
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    // POST /api/v1/auth/register
    const register = async (fullName, phoneNumber, role) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fullName,
                    phoneNumber,
                    role // CUSTOMER, PROVIDER, ADMIN
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            // The response should contain a token
            const authToken = data.token;

            if (authToken) {
                setToken(authToken);
                localStorage.setItem('hirfa-token', authToken);

                const userData = {
                    phoneNumber,
                    fullName,
                    role,
                    fairnessScore: 100,
                    badges: [],
                    verified: false,
                    createdAt: new Date().toISOString()
                };

                setUser(userData);
                localStorage.setItem('hirfa-user', JSON.stringify(userData));

                return { success: true, user: userData, token: authToken };
            }

            throw new Error('No token received');
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('hirfa-token');
        localStorage.removeItem('hirfa-user');
    };

    const updateUser = (updates) => {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem('hirfa-user', JSON.stringify(updatedUser));
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!user && !!token,
        isProvider: user?.role === 'PROVIDER',
        isCustomer: user?.role === 'CUSTOMER',
        isAdmin: user?.role === 'ADMIN',
        login,
        register,
        logout,
        updateUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// Helper function to decode JWT token (without verification)
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
