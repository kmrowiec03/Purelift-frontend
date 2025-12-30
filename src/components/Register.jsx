import React, { useState } from 'react';
import { api } from '../api/axios';
import "/src/style/RegisterLogin.css";
import "/src/style/PageBreak.css";
import {Link,useNavigate} from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage('Hasła nie są takie same.');
            return;
        }

        try {
            await api.post('/security/register', {
                firstName,
                lastName,
                username,
                email,
                password
            });

            setMessage('Rejestracja zakończona sukcesem!');
            navigate("/login");
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
                <img src="/src/assets/logo.png" alt="Purelift Logo" className="form-logo" />
                <form onSubmit={handleRegister}>
                    <div className="form-section">
                        <input
                            className="form-input"
                            type="text"
                            id="firstName"
                            required
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <label className="input-label" htmlFor="firstName">
                            <span className="label-name">Imię</span>
                        </label>
                    </div>

                    <div className="form-section">
                        <input
                            className="form-input"
                            type="text"
                            id="lastName"
                            required
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                        <label className="input-label" htmlFor="lastName">
                            <span className="label-name">Nazwisko</span>
                        </label>
                    </div>

                    <div className="form-section">
                        <input
                            className="form-input"
                            type="text"
                            id="username"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <label className="input-label" htmlFor="username">
                            <span className="label-name">Nazwa użytkownika</span>
                        </label>
                    </div>

                    <div className="form-section">
                        <input
                            className="form-input"
                            type="email"
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
                            id="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <label className="input-label" htmlFor="password">
                            <span className="label-name">Hasło</span>
                        </label>
                    </div>

                    <div className="form-section">
                        <input
                            className="form-input"
                            type="password"
                            id="confirmPassword"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <label className="input-label" htmlFor="confirmPassword">
                            <span className="label-name">Potwierdź hasło</span>
                        </label>
                    </div>

                    <button type="submit" className="Confirm-button">Zarejestruj się</button>
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
};

export default Register;
