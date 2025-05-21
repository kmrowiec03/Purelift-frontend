import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
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
            await axios.post(
                'http://localhost:8080/api/security/authenticate',
                { email, password },
                { withCredentials: true } // Ważne!
            );
            login();
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
