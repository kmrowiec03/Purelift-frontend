import React, { createContext, useContext, useEffect, useState } from 'react';
import {api, getCookie, parseJwt} from '../api/axios';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get('/security/status');
                console.log("DEBUG - /security/status response:", res.data);
                setIsLoggedIn(res.data.loggedIn);
                if (res.data.loggedIn && res.data.user) {
                    console.log("DEBUG - Setting user:", res.data.user);
                    setUser(res.data.user);
                } else if (res.data.loggedIn) {
                    // Jeśli jesteśmy zalogowani ale nie ma danych użytkownika, spróbuj pobrać z innego endpointu
                    console.log("DEBUG - Trying to fetch user data from /users/me");
                    try {
                        const userRes = await api.get('/users/me');
                        console.log("DEBUG - /users/me response:", userRes.data);
                        setUser(userRes.data);
                    } catch (userErr) {
                        console.log("DEBUG - Failed to fetch user data from /users/me:", userErr);
                    }
                } else {
                    console.log("DEBUG - No user data in response or not logged in");
                }
            } catch (e) {
                console.error("Status check failed:", e);
                setIsLoggedIn(false);
                setUser(null);
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
        setUser(null);
        navigate('/');
    };

    if (loading) return <div>Loading...</div>;
    return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export { AuthContext };