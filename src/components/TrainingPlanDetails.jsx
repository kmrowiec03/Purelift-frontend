import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from '../api/axios';
import "/src/style/TrainingPlanDetails.css";
import "/src/style/App.css";

const TrainingPlanDetails = () => {
    const { id } = useParams();
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedDays, setExpandedDays] = useState([]);
    const [weights, setWeights] = useState({});

    useEffect(() => {
        api.get(`/training/${id}`, { withCredentials: true })
            .then((response) => {
                setPlan(response.data);
                const initialWeights = {};
                response.data.trainingDays.forEach(day => {
                    day.exercises.forEach(ex => {
                        initialWeights[ex.id] = ex.weight;
                    });
                });
                setWeights(initialWeights);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Błąd podczas pobierania planu:", error);
                setLoading(false);
            });
    }, [id]);

    const toggleDay = (dayId) => {
        setExpandedDays((prev) =>
            prev.includes(dayId) ? prev.filter((id) => id !== dayId) : [...prev, dayId]
        );
    };

    const handleWeightChange = (exerciseId, value) => {
        setWeights(prev => ({ ...prev, [exerciseId]: value }));
    };

    const saveWeight = (exerciseId) => {
        const weight = parseFloat(weights[exerciseId]);
        if (!isNaN(weight)) {
            api.put(`/training/exercise/${exerciseId}/weight`, { weight }, { withCredentials: true })
                .catch(() => alert("Błąd przy zapisie ciężaru"));
        } else {
            alert("Nieprawidłowa wartość");
        }
    };

    if (loading) return <p>Ładowanie...</p>;
    if (!plan) return <p>Nie znaleziono planu.</p>;

    return (
        <div className="training-plan-details">
            <div className="details-header">
                <h2 className="plan-title">Plan treningowy: {plan.title}</h2>
            </div>

            <div className="training-days-horizontal">
                {plan.trainingDays?.length > 0 ? (
                    plan.trainingDays.map((day) => (
                        <div key={day.id} className="training-day-card-horizontal">
                            <button className="day-toggle-btn" onClick={() => toggleDay(day.id)}>
                                Day {day.dayNumber} {expandedDays.includes(day.id) ? "▲" : "▼"}
                            </button>

                            {expandedDays.includes(day.id) && (
                                <div className="exercise-list-expanded">
                                    {day.exercises && day.exercises.length > 0 ? (
                                        <ul>
                                            {day.exercises.map((exercise) => (
                                                <li key={exercise.id}>
                                                    {exercise.exerciseName} – Serie: {exercise.sets}, Powtórzenia: {exercise.reps}
                                                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginTop: "0.3rem" }}>
                                                        <input
                                                            type="number"
                                                            step="0.1"
                                                            value={weights[exercise.id] ?? ""}
                                                            onChange={(e) => handleWeightChange(exercise.id, e.target.value)}
                                                            style={{ width: "80px" }}
                                                        />
                                                        <span>kg</span>
                                                        <button className="save-weight-btn" onClick={() => saveWeight(exercise.id)}>Zapisz</button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="no-exercises">Brak ćwiczeń dla tego dnia.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p>Brak dni treningowych.</p>
                )}
            </div>
        </div>
    );
};

export default TrainingPlanDetails;
