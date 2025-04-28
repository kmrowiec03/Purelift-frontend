import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "/src/style/TrainingPlanDetails.css";
import "/src/style/App.css";
import "/src/style/PageBreak.css"

const TrainingPlanDetails = () => {
    const { id } = useParams();
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/training/${id}`)
            .then(response => {
                setPlan(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Błąd podczas pobierania planu:", error);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <p>Ładowanie...</p>;
    if (!plan) return <p>Nie znaleziono planu.</p>;

    return (
        <div className="main-content">
            <div className="left-part" style={{ width: "10%", display: "flex", justifyContent: "flex-end" }}>
                <Link id="back_button" to="/trainingPlans">
                    <p>BACK</p>
                </Link>
            </div>

            <div className="center-part" style={{ width: "80%" }}>
                <h2 className="title_in_window">Plan: {plan.title}</h2>

                <div className="Container_for_many_window">
                    {plan.trainingDays.length > 0 ? (
                        plan.trainingDays.map((day) => (
                            <div key={day.id} className="Container_for_window">
                                <p className="text_in_window">Dzień treningowy ID: {day.id}</p>
                            </div>
                        ))
                    ) : (
                        <p>Brak dni treningowych.</p>
                    )}
                </div>
            </div>

            <div className="right-part" style={{ width: "10%" }}></div>
        </div>
    );
};

export default TrainingPlanDetails;