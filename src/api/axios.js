import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true,
});

// Pomocnicza funkcja do wyciągnięcia accessToken z ciasteczka
export const getCookie = function (name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
};

// Pomocnicza funkcja do sparsowania JWT (payload)
export const parseJwt = function (token) {
    if (!token) return null;
    try {
        const base64Payload = token.split('.')[1];
        const payload = atob(base64Payload);
        return JSON.parse(payload);
    } catch {
        return null;
    }
};
