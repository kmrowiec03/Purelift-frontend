import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "/src/style/TrainingPlanDetails.css";
import "/src/style/App.css";

const TrainingPlanDetails = () => {
    const { id } = useParams();
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedDays, setExpandedDays] = useState([]);

    useEffect(() => {
        axios
            .get(`http://localhost:8080/api/training/${id}`, {
                withCredentials: true // <-- Użycie cookies
            })
            .then((response) => {
                setPlan(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Błąd podczas pobierania planu:", error);
                setLoading(false);
            });
    }, [id]);

    const toggleDay = (dayId) => {
        setExpandedDays((prev) =>
            prev.includes(dayId)
                ? prev.filter((id) => id !== dayId)
                : [...prev, dayId]
        );
    };

    if (loading) return <p>Ładowanie...</p>;
    if (!plan) return <p>Nie znaleziono planu.</p>;

    return (
        <div className="training-plan-details">
            <div className="details-header">
                <h2 className="plan-title">Plan treningowy: {plan.title}</h2>
            </div>

            <div className="training-days-horizontal">
                {plan.trainingDays.length > 0 ? (
                    plan.trainingDays.map((day) => (
                        <div key={day.id} className="training-day-card-horizontal">
                            <button className="day-toggle-btn" onClick={() => toggleDay(day.id)}>
                                Day {day.id} {expandedDays.includes(day.id) ? "▲" : "▼"}
                            </button>

                            {expandedDays.includes(day.id) && (
                                <div className="exercise-list-expanded">
                                    {day.exercises && day.exercises.length > 0 ? (
                                        <ul>
                                            {day.exercises.map((exercise, index) => (
                                                <p key={index}>
                                                    {exercise.exerciseName} – Series: {exercise.sets}, Reps: {exercise.reps}, Weight: {exercise.weight}
                                                </p>
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
