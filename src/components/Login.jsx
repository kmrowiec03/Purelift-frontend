import React, { useState } from 'react';
import { useAuth } from '../actions/AuthContext.jsx';
import { useNavigate } from "react-router-dom";
import {api, getCookie, parseJwt} from '../api/axios';
import "/src/style/RegisterLogin.css";
import "/src/style/PageBreak.css";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await api.post(
                '/security/authenticate',
                { email, password },
                { withCredentials: true }
            );
            login();
            const token = getCookie('accessToken');
            const payload = parseJwt(token);
            if (!payload) {
                return;
            }

            navigate('/');
        } catch (error) {
            if (error.response?.data?.error) {
                setMessage(error.response.data.error);
            } else {
                setMessage("Błąd logowania.");
            }
        }
    };

    return (
        <div className="main-content">
            <div className="Container_column">
                <form onSubmit={handleLogin}>
                    <div className="form-section">
                        <input
                            className="form-input"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <label className="input-label">
                            <span className="label-name">Email</span>
                        </label>
                    </div>

                    <div className="form-section">
                        <input
                            className="form-input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <label className="input-label">
                            <span className="label-name">Hasło</span>
                        </label>
                    </div>

                    <button type="submit" className="Confirm-button">Zaloguj się</button>
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
};

export default Login;
