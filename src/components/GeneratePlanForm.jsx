import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios.js";

const GeneratePlanForm = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("generate");
    const [title, setTitle] = useState("");
    const [numberOfDays, setNumberOfDays] = useState(1);
    const [numberOfWeeks, setNumberOfWeeks] = useState(1);
    const [exercisesPerDay, setExercisesPerDay] = useState(1);
    const [planType, setPlanType] = useState("UPPER_LOWER");
    const [message, setMessage] = useState("");
    // Catalog data for manual plan creator
    const [exerciseTemplates, setExerciseTemplates] = useState([]);
    const [templateMuscles, setTemplateMuscles] = useState([]);
    const [selectedTemplateId, setSelectedTemplateId] = useState("");
    const [selectedMuscleIds, setSelectedMuscleIds] = useState([]);
    // Plan builder state
    const [planTitle, setPlanTitle] = useState("");
    const [planDays, setPlanDays] = useState([]);
    const [selectedDayIndex, setSelectedDayIndex] = useState(null);
    const [currentExercisePage, setCurrentExercisePage] = useState(0);

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

    // Fetch catalog data when switching to the "create" tab (or on first render)
    useEffect(() => {
        const fetchCatalog = async () => {
            try {
                const templatesRes = await api.get("/catalog/exercise-templates", { withCredentials: true });
                console.log("exercise-templates response:", templatesRes.data);
                const templates = Array.isArray(templatesRes.data)
                    ? templatesRes.data
                    : (templatesRes.data?.content ?? templatesRes.data?.items ?? []);
                setExerciseTemplates(templates ?? []);
            } catch (err) {
                console.error("Błąd pobierania katalogu ćwiczeń/mięśni:", err);
            }
        };
        // Load once when component mounts, and also when user switches to create tab
        if (activeTab === "create" && (exerciseTemplates.length === 0)) {
            fetchCatalog();
        }
    }, [activeTab]);

    // Fetch muscles with intensity for selected template
    useEffect(() => {
        const fetchTemplateMuscles = async () => {
            if (!selectedTemplateId) {
                setTemplateMuscles([]);
                return;
            }
            try {
                const res = await api.get(`/catalog/exercise/${selectedTemplateId}/muscles`, { withCredentials: true });
                setTemplateMuscles(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error("Błąd pobierania mięśni dla ćwiczenia:", err);
                setTemplateMuscles([]);
            }
        };
        fetchTemplateMuscles();
    }, [selectedTemplateId]);

    // Add a new training day
    const addTrainingDay = () => {
        const newDay = {
            id: Date.now(),
            dayNumber: planDays.length + 1,
            exercises: []
        };
        setPlanDays([...planDays, newDay]);
        setSelectedDayIndex(planDays.length); // Auto-select newly added day
    };

    // Add exercise to selected day
    const addExerciseToDay = () => {
        if (selectedDayIndex === null || !selectedTemplateId) return;
        const selectedTemplate = exerciseTemplates.find(t => String(t.id) === String(selectedTemplateId));
        if (!selectedTemplate) return;

        const updatedDays = [...planDays];
        updatedDays[selectedDayIndex].exercises.push({
            id: Date.now(),
            templateId: selectedTemplateId,
            name: selectedTemplate.name,
            description: selectedTemplate.description,
            muscles: templateMuscles
        });
        setPlanDays(updatedDays);
        setSelectedTemplateId(""); // Reset selection
        setTemplateMuscles([]);
    };

    // Remove exercise from day
    const removeExerciseFromDay = (dayIndex, exerciseIndex) => {
        const updatedDays = [...planDays];
        updatedDays[dayIndex].exercises.splice(exerciseIndex, 1);
        setPlanDays(updatedDays);
    };

    // Remove training day
    const removeTrainingDay = (dayIndex) => {
        const updatedDays = planDays.filter((_, idx) => idx !== dayIndex);
        setPlanDays(updatedDays);
        if (selectedDayIndex === dayIndex) {
            setSelectedDayIndex(null);
        }
    };

    // Pagination for exercises (3 cols x 5 rows = 15 per page)
    const EXERCISES_PER_PAGE = 15;
    const totalExercisePages = Math.ceil(exerciseTemplates.length / EXERCISES_PER_PAGE);
    const getPaginatedExercises = () => {
        const start = currentExercisePage * EXERCISES_PER_PAGE;
        return exerciseTemplates.slice(start, start + EXERCISES_PER_PAGE);
    };
    const nextExercisePage = () => {
        if (currentExercisePage < totalExercisePages - 1) {
            setCurrentExercisePage(currentExercisePage + 1);
        }
    };
    const prevExercisePage = () => {
        if (currentExercisePage > 0) {
            setCurrentExercisePage(currentExercisePage - 1);
        }
    };

    return (
        <div className="profile-wrapper">
            <div className="profile-container">
                <div className="tabs-container">
                    <button 
                        className={`tab-button ${activeTab === "generate" ? "active" : ""}`}
                        onClick={() => setActiveTab("generate")}
                    >
                        Wygeneruj plan
                    </button>
                    <button 
                        className={`tab-button ${activeTab === "create" ? "active" : ""}`}
                        onClick={() => setActiveTab("create")}
                    >
                        Stwórz plan
                    </button>
                </div>

                {activeTab === "generate" && (
                    <>
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
                    </>
                )}

                {activeTab === "create" && (
                    <div className="create-plan-wrapper">
                        {/* Two-column layout: left (exercise selection) + right (day details) */}
                        <div className="create-plan-layout">
                            {/* LEFT: Exercise selector and day list */}
                            <div className="create-plan-left">
                                <h3 className="text-white mb-2">Wybierz ćwiczenie</h3>
                                
                                {/* Pagination controls */}
                                {totalExercisePages > 1 && (
                                    <div className="pagination-controls">
                                        <button 
                                            className="pagination-btn" 
                                            onClick={prevExercisePage}
                                            disabled={currentExercisePage === 0}
                                        >
                                            ← Poprzednia
                                        </button>
                                        <span className="pagination-info">
                                            Strona {currentExercisePage + 1} z {totalExercisePages}
                                        </span>
                                        <button 
                                            className="pagination-btn" 
                                            onClick={nextExercisePage}
                                            disabled={currentExercisePage === totalExercisePages - 1}
                                        >
                                            Następna →
                                        </button>
                                    </div>
                                )}
                                
                                <div className="exercise-cards-grid">
                                    {getPaginatedExercises().map((tpl) => (
                                        <div 
                                            key={tpl.id}
                                            className={`exercise-card-tile ${selectedTemplateId === String(tpl.id) ? 'active' : ''}`}
                                            onClick={() => setSelectedTemplateId(String(tpl.id))}
                                        >
                                            <span className="exercise-card-tile-text">{tpl.name}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Exercise details under cards */}
                                {selectedTemplateId && (
                                    <div className="exercise-details-section">
                                        <p className="text-white" style={{ fontWeight: 600, marginBottom: "0.5rem" }}>
                                            {exerciseTemplates.find(t => String(t.id) === String(selectedTemplateId))?.name}
                                        </p>
                                        <p className="text-white text-sm" style={{ marginBottom: "0.5rem" }}>
                                            {exerciseTemplates.find(t => String(t.id) === String(selectedTemplateId))?.description}
                                        </p>
                                        <h4 className="text-white text-sm" style={{ marginBottom: "0.25rem", fontWeight: 600 }}>Mięśnie:</h4>
                                        {templateMuscles.length > 0 ? (
                                            <ul className="text-white text-sm" style={{ listStyle: "none", padding: 0, marginBottom: 0 }}>
                                                {templateMuscles.map((tm) => (
                                                    <li key={tm.id} style={{ marginBottom: "0.25rem" }}>
                                                        <span style={{ fontWeight: 600 }}>{tm.muscleName}</span> – {tm.intensity}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-white text-sm">Brak danych</p>
                                        )}
                                    </div>
                                )}

                                <h3 className="text-white mt-4 mb-2">Dni treningowe</h3>
                                <div className="days-list-container">
                                    {planDays.map((day, idx) => (
                                        <div 
                                            key={day.id}
                                            className={`day-item ${selectedDayIndex === idx ? 'active' : ''}`}
                                            onClick={() => setSelectedDayIndex(idx)}
                                        >
                                            <span>Dzień {day.dayNumber} ({day.exercises.length} ćw.)</span>
                                            <button
                                                className="remove-day-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeTrainingDay(idx);
                                                }}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button className="add-day-btn" onClick={addTrainingDay}>
                                    + Dodaj dzień
                                </button>
                            </div>

                            {/* RIGHT: Day management and exercise editing */}
                            <div className="create-plan-right">
                                <h3 className="text-white" style={{ margin: "0 0 0.75rem 0" }}>Edycja dnia treningowego</h3>
                                
                                {selectedDayIndex !== null ? (
                                    <>
                                        <div className="profile-section">
                                            <h4 className="text-white mb-2">Dzień {planDays[selectedDayIndex]?.dayNumber}</h4>
                                            {planDays[selectedDayIndex]?.exercises.length > 0 ? (
                                                <ul style={{ listStyle: "none", padding: 0 }}>
                                                    {planDays[selectedDayIndex].exercises.map((ex, exIdx) => (
                                                        <li key={ex.id} className="exercise-edit-item">
                                                            <div className="exercise-name">
                                                                <span className="text-white" style={{ fontWeight: 600 }}>{ex.name}</span>
                                                                <button
                                                                    className="remove-ex-btn"
                                                                    onClick={() => removeExerciseFromDay(selectedDayIndex, exIdx)}
                                                                >
                                                                    ✕
                                                                </button>
                                                            </div>
                                                            <div className="exercise-sets-reps">
                                                                <label className="text-white text-sm">
                                                                    Serie:
                                                                    <input type="number" min="1" placeholder="3" className="exercise-input" />
                                                                </label>
                                                                <label className="text-white text-sm">
                                                                    Powtórzenia:
                                                                    <input type="number" min="1" placeholder="10" className="exercise-input" />
                                                                </label>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-white text-sm">Brak ćwiczeń. Dodaj ćwiczenie z lewej strony.</p>
                                            )}
                                        </div>

                                        {selectedTemplateId && (
                                            <div className="profile-section">
                                                <button 
                                                    className="lock-button w-full"
                                                    onClick={addExerciseToDay}
                                                >
                                                    + Dodaj ćwiczenie
                                                </button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-white text-sm">Wybierz dzień treningowy z lewej strony, aby edytować.</p>
                                )}

                                <h3 className="text-white mt-4" style={{ margin: "1rem 0 0.75rem 0" }}>Zarządzanie dniami</h3>
                                <div className="days-list-container">
                                    {planDays.map((day, idx) => (
                                        <div 
                                            key={day.id}
                                            className={`day-item ${selectedDayIndex === idx ? 'active' : ''}`}
                                            onClick={() => setSelectedDayIndex(idx)}
                                        >
                                            <span>Dzień {day.dayNumber} ({day.exercises.length} ćw.)</span>
                                            <button
                                                className="remove-day-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeTrainingDay(idx);
                                                }}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button className="add-day-btn" onClick={addTrainingDay}>
                                    + Dodaj dzień
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GeneratePlanForm;
