import React, { useState } from "react";
import { api } from "../api/axios.js";

const GeneratePlanForm = () => {
    const [title, setTitle] = useState("");
    const [numberOfDays, setNumberOfDays] = useState(1);
    const [exercisesPerDay, setExercisesPerDay] = useState(1);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/training/generate", {
                title,
                numberOfDays,
                exercisesPerDay,
            }, { withCredentials: true });
            setMessage("Plan treningowy został wygenerowany!");
            setTitle("");
            setNumberOfDays(1);
            setExercisesPerDay(1);
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
                        <label className="profile-label">Liczba dni treningowych</label>
                        <input
                            type="number"
                            min="1"
                            value={numberOfDays}
                            onChange={(e) => setNumberOfDays(parseInt(e.target.value))}
                            className="w-full p-2 rounded text-black"
                            required
                        />
                    </div>
                    <div className="profile-section">
                        <label className="profile-label">Ćwiczeń na dzień</label>
                        <input
                            type="number"
                            min="1"
                            value={exercisesPerDay}
                            onChange={(e) => setExercisesPerDay(parseInt(e.target.value))}
                            className="w-full p-2 rounded text-black"
                            required
                        />
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

export default GeneratePlanForm;
