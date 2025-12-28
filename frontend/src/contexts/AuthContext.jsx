import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Mock user for demo purposes
const MOCK_USERS = {
    '12345678': {
        id: 1,
        phoneNumber: '12345678',
        fullName: 'أحمد بن علي',
        role: 'PROVIDER',
        fairnessScore: 85,
        badges: ['The Flash', 'Neighborhood Hero'],
        verified: true,
        createdAt: '2024-01-15T10:00:00Z'
    },
    '87654321': {
        id: 2,
        phoneNumber: '87654321',
        fullName: 'سارة المنصوري',
        role: 'CUSTOMER',
        fairnessScore: 92,
        badges: ['Fair Customer'],
        verified: true,
        createdAt: '2024-02-20T14:30:00Z'
    }
};

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
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (phoneNumber) => {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const mockUser = MOCK_USERS[phoneNumber];
                if (mockUser) {
                    const mockToken = 'mock-jwt-token-' + Date.now();
                    setToken(mockToken);
                    setUser(mockUser);
                    localStorage.setItem('hirfa-token', mockToken);
                    localStorage.setItem('hirfa-user', JSON.stringify(mockUser));
                    resolve({ success: true, user: mockUser });
                } else {
                    // Create new user for demo
                    const newUser = {
                        id: Date.now(),
                        phoneNumber,
                        fullName: 'مستخدم جديد',
                        role: 'CUSTOMER',
                        fairnessScore: 100,
                        badges: [],
                        verified: false,
                        createdAt: new Date().toISOString()
                    };
                    const mockToken = 'mock-jwt-token-' + Date.now();
                    setToken(mockToken);
                    setUser(newUser);
                    localStorage.setItem('hirfa-token', mockToken);
                    localStorage.setItem('hirfa-user', JSON.stringify(newUser));
                    resolve({ success: true, user: newUser });
                }
            }, 500);
        });
    };

    const register = async (fullName, phoneNumber, role) => {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                const newUser = {
                    id: Date.now(),
                    phoneNumber,
                    fullName,
                    role,
                    fairnessScore: 100,
                    badges: [],
                    verified: false,
                    createdAt: new Date().toISOString()
                };
                const mockToken = 'mock-jwt-token-' + Date.now();
                setToken(mockToken);
                setUser(newUser);
                localStorage.setItem('hirfa-token', mockToken);
                localStorage.setItem('hirfa-user', JSON.stringify(newUser));
                resolve({ success: true, user: newUser });
            }, 500);
        });
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
        isAuthenticated: !!user,
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

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
