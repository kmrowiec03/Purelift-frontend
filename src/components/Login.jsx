import React, { useState } from 'react';
import {useNavigate} from "react-router-dom";
import { useAuth } from '/src/components/AuthContext.jsx';
import axios from 'axios';
import "/src/style/RegisterLogin.css"
import "/src/style/PageBreak.css";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const { login } = useAuth();

    const handleLogin = async (e) => {

        try {
            e.preventDefault();
            const response = await axios.post('http://localhost:8080/api/security/authenticate', {
                email,
                password
            });

            const { token } = response.data;
            login(token);
            navigate('/');
        } catch (error) {
            if (error.response && error.response.data?.error) {
                setMessage(error.response.data.error);
            } else {
                setMessage("Błąd rejestracji.");
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
                            name="email"
                            id="email"
                            autoComplete="off"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label className="input-label" htmlFor="email">
                            <span className="label-name">Email</span>
                        </label>
                    </div>

                    <div className="form-section">
                        <input
                            className="form-input"
                            type="password"
                            name="password"
                            id="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <label className="input-label" htmlFor="password">
                            <span className="label-name">Password</span>
                        </label>
                    </div>

                    <button type="submit" className="Confirm-button"> Zaloguj się</button>
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
};

export default Login;
