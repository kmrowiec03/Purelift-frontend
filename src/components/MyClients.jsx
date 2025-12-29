import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from '../api/axios';
import { useAuth } from "../actions/AuthContext.jsx";
import "../style/MyClients.css";

const MyClients = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClientsAndRequests = async () => {
            if (!user?.id) {
                setLoading(false);
                return;
            }
            
            try {
                // Pobierz oczekujące prośby
                const requestsResponse = await api.get("/coaches/requests?status=PENDING", {
                    withCredentials: true
                });
                console.log("=== OCZEKUJĄCE PROŚBY ===");
                console.log("Response:", requestsResponse);
                console.log("Data:", requestsResponse.data);
                console.log("Is Array:", Array.isArray(requestsResponse.data));
                console.log("Length:", requestsResponse.data?.length);
                console.log("========================");
                setRequests(Array.isArray(requestsResponse.data) ? requestsResponse.data : []);
            } catch (err) {
                console.error("Błąd podczas pobierania danych:", err.response || err.message);
                setError("Nie udało się pobrać danych.");
            } finally {
                setLoading(false);
            }
        };

        fetchClientsAndRequests();
    }, [user?.id]);

    const handleAcceptRequest = async (request) => {
        try {
            await api.post(`/coaches/requests/${request.id}/accept`, {}, { withCredentials: true });
            // Usuń zaakceptowaną prośbę z listy i przejdź do tworzenia planu
            setRequests(prev => prev.filter(req => req.id !== request.id));
            alert("Prośba zaakceptowana! Przejdź do tworzenia planu.");
            navigate('/create-plan', { state: { userEmail: request.clientEmail } });
        } catch (err) {
            console.error("Błąd podczas akceptowania prośby:", err);
            alert("Nie udało się zaakceptować prośby.");
        }
    };

    const handleRejectRequest = async (requestId) => {
        if (!window.confirm("Czy na pewno chcesz odrzucić tę prośbę?")) {
            return;
        }
        
        try {
            await api.post(`/coaches/requests/${requestId}/reject`, {}, { withCredentials: true });
            setRequests(requests.filter(req => req.id !== requestId));
            alert("Prośba odrzucona.");
        } catch (err) {
            console.error("Błąd podczas odrzucania prośby:", err);
            alert("Nie udało się odrzucić prośby.");
        }
    };

    

    if (loading) return <div className="loading-message">Ładowanie podopiecznych...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (user?.role === 'ROLE_ADMIN') return <div className="error-message">Ta strona nie jest dostępna dla administratora.</div>;

    return (
        <div className="clients-page">
            <h1 className="clients-header">Panel trenera</h1>
            
            {/* Prośby o plan treningowy — tylko lista oczekujących */}
            <div className="requests-panel">
                <h2 className="section-title">Prośby o plan treningowy ({requests.length})</h2>
                <div className="requests-container">
                    {requests.length > 0 ? (
                        requests.map((request) => (
                            <div className="request-card" key={request.id}>
                                <div className="request-avatar">
                                    {request.clientName?.[0] || request.clientEmail?.[0]?.toUpperCase() || "?"}
                                </div>
                                <h3 className="request-client-name">
                                    {request.clientName || request.clientEmail}
                                </h3>
                                <p className="request-email">{request.clientEmail}</p>
                                <div className="request-message">
                                    <strong>Wiadomość:</strong>
                                    <p>{request.message}</p>
                                </div>
                                <div className="request-actions">
                                    <button 
                                        className="accept-request-btn"
                                        onClick={() => handleAcceptRequest(request)}
                                    >
                                        Akceptuj i stwórz plan
                                    </button>
                                    <button 
                                        className="reject-request-btn"
                                        onClick={() => handleRejectRequest(request.id)}
                                    >
                                        Odrzuć
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-clients-message">Brak oczekujących próśb.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyClients;
