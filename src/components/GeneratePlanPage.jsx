import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios.js";
import "/src/style/Profile.css";

const GeneratePlanPage = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [numberOfDays, setNumberOfDays] = useState(1);
    const [numberOfWeeks, setNumberOfWeeks] = useState(1);
    const [exercisesPerDay, setExercisesPerDay] = useState(1);
    const [planType, setPlanType] = useState("UPPER_LOWER");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/training/generate", {
                title,
                numberOfDays,
                numberOfWeeks,
                exercisesPerDay,
                planType,
            }, { withCredentials: true });
            setMessage("Plan treningowy został wygenerowany!");
            setTitle("");
            setNumberOfDays(1);
            setNumberOfWeeks(1);
            setExercisesPerDay(1);
            setPlanType("UPPER_LOWER");
            navigate('/trainingPlans');
        } catch {
            setMessage("Wystąpił błąd podczas generowania planu.");
        }
    };

    return (
        <div className="profile-wrapper">
            <div className="profile-container">
                <h2 className="profile-header">Generuj plan treningowy</h2>
                <form onSubmit={handleSubmit}>
                    <div className="profile-section">
                        <label className="profile-label">Tytuł planu</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2 rounded text-black"
                            required
                        />
                    </div>
                    <div className="profile-section">
                        <label className="profile-label">Liczba dni treningowych (max 4)</label>
                        <input
                            type="number"
                            min="1"
                            max="4"
                            value={numberOfDays}
                            onChange={(e) => setNumberOfDays(parseInt(e.target.value))}
                            className="w-full p-2 rounded text-black"
                            required
                        />
                    </div>
                    <div className="profile-section">
                        <label className="profile-label">Liczba tygodni (max 8)</label>
                        <input
                            type="number"
                            min="1"
                            max="8"
                            value={numberOfWeeks}
                            onChange={(e) => setNumberOfWeeks(parseInt(e.target.value))}
                            className="w-full p-2 rounded text-black"
                            required
                        />
                    </div>
                    <div className="profile-section">
                        <label className="profile-label">Ćwiczeń na dzień (max 7)</label>
                        <input
                            type="number"
                            min="1"
                            max="7"
                            value={exercisesPerDay}
                            onChange={(e) => setExercisesPerDay(parseInt(e.target.value))}
                            className="w-full p-2 rounded text-black"
                            required
                        />
                    </div>
                    <div className="profile-section">
                        <label className="profile-label">Typ planu</label>
                        <select
                            value={planType}
                            onChange={(e) => setPlanType(e.target.value)}
                            className="w-full p-2 rounded text-black"
                            required
                        >
                            <option value="UPPER_LOWER">Upper Lower</option>
                            <option value="FULL_BODY">Full Body</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="lock-button w-full mt-2"
                    >
                        Generuj plan
                    </button>
                </form>
                {message && (
                    <p className="mt-4 text-center text-white font-semibold">{message}</p>
                )}
            </div>
        </div>
    );
};

export default GeneratePlanPage;
