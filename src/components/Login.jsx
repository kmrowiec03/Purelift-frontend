// src/components/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    // Funkcja do logowania użytkownika
    const handleLogin = async (e) => {
        e.preventDefault();

        const response = await axios.post('http://localhost:8080/api/security/authenticate', {
            email,
            password
        });

        const { token } = response.data;
        localStorage.setItem('jwt', token);
        setMessage('Login successful!');

    };

    return (
        <div>
            <h1>Login</h1>

            {/* Form do logowania */}
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>

            {/* Wyświetlanie komunikatów */}
            {message && <p>{message}</p>}
        </div>
    );
};

export default Login;
