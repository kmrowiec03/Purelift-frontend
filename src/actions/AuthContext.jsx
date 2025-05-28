import React, { createContext, useContext, useEffect, useState } from 'react';
import {api, getCookie, parseJwt} from '../api/axios';
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get('/security/status');
                setIsLoggedIn(res.data.loggedIn);
            } catch (e) {
                console.error("Status check failed:", e);
                setIsLoggedIn(false);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);


    useEffect(() => {
        const interceptor = api.interceptors.request.use(async (config) => {
            console.log('Interceptor fired');
            const accessToken = getCookie('accessToken');
            const payload = parseJwt(accessToken);

            if (payload) {
                const now = Date.now() / 1000;
                const expiresIn = payload.exp - now;

                console.log('[DEBUG] Token expires at (exp):', payload.exp);
                console.log('[DEBUG] Current time (JS):', now);
                console.log('[DEBUG] Time left (expiresIn):', expiresIn);

                if (expiresIn < 20) {
                    try {
                        await axios.post('http://localhost:8080/api/security/refresh-token', {}, { withCredentials: true });
                        console.log('[AUTH] Token refreshed');
                    } catch (error) {
                        console.error('[AUTH] Token refresh failed', error);
                        logout(true);
                        return Promise.reject(error);
                    }
                }
            }

            return config;
        });

        return () => {
            api.interceptors.request.eject(interceptor);
        };
    }, [isLoggedIn,loading]);

    const login = () => {
        setIsLoggedIn(true);
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