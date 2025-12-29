import React, { useEffect, useState } from "react";
import { api } from '../api/axios';
import { useAuth } from "../actions/AuthContext.jsx";
import "../style/CoachList.css";

const CoachList = () => {
    const [coaches, setCoaches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isLoggedIn, user } = useAuth();
    const [selectedCoachId, setSelectedCoachId] = useState(null);
    const [requestMessage, setRequestMessage] = useState("");

    useEffect(() => {
        const fetchCoaches = async () => {
            try {
                const response = await api.get("/coaches", {
                    withCredentials: true
                });
                console.log("Trenerzy z backendu:", response.data);
                setCoaches(response.data);
            } catch (err) {
                console.error("Błąd podczas pobierania trenerów:", err.response || err.message);
                setError("Nie udało się pobrać listy trenerów.");
            } finally {
                setLoading(false);
            }
        };

        fetchCoaches();
    }, []);

    const handleSendRequest = async (coachId) => {
        if (!isLoggedIn) {
            alert("Musisz być zalogowany, aby wysłać prośbę do trenera.");
            return;
        }
        
        if (!requestMessage.trim()) {
            alert("Proszę opisać swoje wymagania i cele treningowe.");
            return;
        }
        
        try {
            await api.post(`/coaches/${coachId}/request`, 
                { message: requestMessage.trim() }, 
                { withCredentials: true }
            );
            alert("Prośba została wysłana do trenera!");
            setSelectedCoachId(null);
            setRequestMessage("");
        } catch (err) {
            console.error("Błąd podczas wysyłania prośby:", err);
            const errorMsg = err.response?.data?.message || err.response?.data || "Nie udało się wysłać prośby.";
            alert(errorMsg);
        }
    };
    
    const handleOpenRequestForm = (coachId) => {
        setSelectedCoachId(coachId);
        setRequestMessage("");
    };
    
    const handleCancelRequest = () => {
        setSelectedCoachId(null);
        setRequestMessage("");
    };

    // Sprawdź czy zalogowany użytkownik to trener
    const isCoach = user?.role === 'ROLE_COACH';
    const isAdmin = user?.role === 'ROLE_ADMIN';

    if (loading) return <div className="loading-message">Ładowanie trenerów...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (isAdmin) return <div className="error-message">Ta strona nie jest dostępna dla administratora.</div>;

    return (
        <div className="coaches-page">
            <h1 className="coaches-header">Dostępni Trenerzy</h1>
            <div className="coaches-container">
                {coaches.length > 0 ? (
                    coaches.map((coach) => (
                        <div 
                            className="coach-card"
                            key={coach.id}
                        >
                            <div className="coach-avatar">
                                {coach.firstName?.[0] || coach.email[0].toUpperCase()}
                            </div>
                            <h3 className="coach-name">
                                {coach.firstName && coach.lastName 
                                    ? `${coach.firstName} ${coach.lastName}`
                                    : coach.email}
                            </h3>
                            <p className="coach-email">{coach.email}</p>
                            
                            {/* Przycisk kontaktu tylko dla zwykłych użytkowników */}
                            {isLoggedIn && !isCoach && !isAdmin && user?.id !== coach.id && (
                                <>
                                    {selectedCoachId === coach.id ? (
                                        <div className="request-form">
                                            <textarea
                                                className="request-textarea"
                                                placeholder="Opisz wymagania dla planu treningowego, cele i oczekiwania..."
                                                value={requestMessage}
                                                onChange={(e) => setRequestMessage(e.target.value)}
                                                rows={4}
                                            />
                                            <div className="request-buttons">
                                                <button 
                                                    className="send-request-btn"
                                                    onClick={() => handleSendRequest(coach.id)}
                                                >
                                                    Wyślij prośbę o plan
                                                </button>
                                                <button 
                                                    className="cancel-request-btn"
                                                    onClick={handleCancelRequest}
                                                >
                                                    Anuluj
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button 
                                            className="contact-coach-btn"
                                            onClick={() => handleOpenRequestForm(coach.id)}
                                        >
                                            Poproś o plan
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="no-coaches-message">Brak dostępnych trenerów.</p>
                )}
            </div>
        </div>
    );
};

export default CoachList;
