import React, { useEffect, useState } from "react";
import { api } from "../api/axios.js";
import "../style/Profile.css";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [showUsers, setShowUsers] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get("/users/me", {
                    withCredentials: true,
                });
                setUser(response.data);
            } catch {
                setError("Nie udało się pobrać danych użytkownika.");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);
    useEffect(() => {
        if (showUsers && allUsers.length === 0) {
            loadAllUsers();
        }
    }, [showUsers]);
    const toggleUserList = () => {
        setShowUsers(prev => !prev);
    };

    const loadAllUsers = async () => {
        try {
            const response = await api.get("/users", { withCredentials: true });
            setAllUsers(response.data);
        } catch (err) {
            console.error("Błąd podczas pobierania użytkowników:", err);
        }
    };

    const toggleLockStatus = async (userId, currentlyLocked) => {
        try {
            await api.patch(`/users/${userId}/lock`, {
                locked: !currentlyLocked,
            }, { withCredentials: true });

            setAllUsers(prev =>
                prev.map(u =>
                    u.id === userId ? { ...u, locked: !currentlyLocked } : u
                )
            );
        } catch (err) {
            console.error("Błąd podczas aktualizacji statusu konta:", err);
        }
    };

    if (loading) return <p>Ładowanie profilu...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="profile-wrapper">
            <div className="profile-container">
                <h2 className="profile-header">Twój profil</h2>

                <div className="profile-section">
                    <span className="profile-label">Imię:</span>
                    <span className="profile-value">{user.name}</span>

                    <span className="profile-label">Nazwisko:</span>
                    <span className="profile-value">{user.lastname}</span>

                    <span className="profile-label">Nazwa użytkownika:</span>
                    <span className="profile-value">{user.username}</span>

                    <span className="profile-label">Email:</span>
                    <span className="profile-value">{user.email}</span>

                    <span className="profile-label">Rola:</span>
                    <span className="profile-value">{user.role}</span>
                </div>

                <div className="profile-section">
                    <span className="profile-label">Aktywne konto:</span>
                    <span className="profile-value">{user.enabled ? "Tak" : "Nie"}</span>

                    <span className="profile-label">Zablokowane konto:</span>
                    <span className="profile-value">{user.locked ? "Tak" : "Nie"}</span>
                </div>

                <div className="profile-section">
                    <span className="profile-label">Plany treningowe:</span>
                    {user.trainingPlanTitles.length > 0 ? (
                        <ul className="profile-value">
                            {user.trainingPlanTitles.map((title, index) => (
                                <li key={index}>{title}</li>
                            ))}
                        </ul>
                    ) : (
                        <span className="profile-value">Brak przypisanych planów.</span>
                    )}
                </div>

                {user.role === "ROLE_ADMIN" && (
                    <div className="admin-section">
                        <button onClick={toggleUserList}>
                            {showUsers ? "Ukryj użytkowników" : "Pokaż wszystkich użytkowników"}
                        </button>

                        {showUsers && (
                            <div className="user-list">
                                <table className="user-table">
                                    <thead>
                                    <tr>
                                        <th>Email</th>
                                        <th>Akcja</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {allUsers.map((u) => (
                                        <tr key={u.id}>
                                            <td>{u.email}</td>
                                            <td>
                                                <button
                                                    onClick={() => toggleLockStatus(u.id, u.locked)}
                                                    className="lock-button"
                                                >
                                                    {u.locked ? "Odblokuj" : "Zablokuj"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
