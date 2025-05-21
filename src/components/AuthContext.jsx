import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:8080/api/security/status', {
            withCredentials: true
        }).then(() => {
            setIsLoggedIn(true);
        }).catch(() => {
            setIsLoggedIn(false);
        }).finally(() => {
            setLoading(false);
        });
    }, []);

    const login = () => {
        setIsLoggedIn(true); // ustawiamy po udanym logowaniu
    };

    const logout = async () => {
        try {
            await axios.post('http://localhost:8080/api/security/logout', {}, {
                withCredentials: true
            });
        } catch (e) {
            console.error("Logout error:", e);
        }
        setIsLoggedIn(false);
    };

    if (loading) return <div>Loading...</div>;
    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);