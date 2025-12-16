import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios.js";
import "/src/style/CreatePlanPage.css";

const CreatePlanPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    
    // Debug - sprawdzamy co zawiera user
    console.log("DEBUG - user object:", user);
    console.log("DEBUG - user.role:", user?.role);
    
    // Catalog data for manual plan creator
    const [exerciseTemplates, setExerciseTemplates] = useState([]);
    const [templateMuscles, setTemplateMuscles] = useState([]);
    const [selectedTemplateId, setSelectedTemplateId] = useState("");
    const [selectedMuscleIds, setSelectedMuscleIds] = useState([]);
    
    // Plan builder state
    const [planDays, setPlanDays] = useState([]);
    const [selectedDayIndex, setSelectedDayIndex] = useState(null);
    const [currentExercisePage, setCurrentExercisePage] = useState(0);
    const [message, setMessage] = useState("");
    const [seriesData, setSeriesData] = useState({});
    const [repsData, setRepsData] = useState({});
    const [planTitle, setPlanTitle] = useState("");
    const [userEmail, setUserEmail] = useState("");
    

    // Fetch catalog data on component mount
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get("/users/me", { withCredentials: true });
                setUser(response.data);
            } catch (err) {
                console.error("Błąd pobierania danych użytkownika:", err);
            }
        };
        
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
        
        fetchUser();
        fetchCatalog();
    }, []);

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

    // Save plan (placeholder - will need backend integration)
    const handleSavePlan = async () => {
        if (planDays.length === 0) {
            setMessage("Dodaj co najmniej jeden dzień treningowy!");
            return;
        }
        if (!planTitle.trim()) {
            setMessage("Wprowadź tytuł planu!");
            return;
        }
        try {
            const planData = {
                title: planTitle.trim(),
                days: planDays.map(day => ({
                    ...day,
                    exercises: day.exercises.map(exercise => ({
                        ...exercise,
                        series: seriesData[exercise.id] ? parseInt(seriesData[exercise.id]) : null,
                        reps: repsData[exercise.id] ? parseInt(repsData[exercise.id]) : null
                    }))
                }))
            };
            await api.post("/training/create-manual", planData, { withCredentials: true });
            console.log("Plan do zapisania:", planData);
            setMessage("Plan został zapisany!");
            setTimeout(() => navigate('/trainingPlans'), 1500);
        } catch (err) {
            console.error("Błąd zapisywania planu:", err);
            setMessage("Błąd podczas zapisywania planu.");
        }
    };

    // Assign plan to user (for COACH role)
    const handleAssignPlan = async () => {
        if (planDays.length === 0) {
            setMessage("Dodaj co najmniej jeden dzień treningowy!");
            return;
        }
        if (!planTitle.trim()) {
            setMessage("Wprowadź tytuł planu!");
            return;
        }
        if (!userEmail.trim()) {
            setMessage("Wprowadź adres email użytkownika!");
            return;
        }
        try {
            const planData = {
                title: planTitle.trim(),
                userEmail: userEmail.trim(),
                days: planDays.map(day => ({
                    ...day,
                    exercises: day.exercises.map(exercise => ({
                        ...exercise,
                        series: seriesData[exercise.id] ? parseInt(seriesData[exercise.id]) : null,
                        reps: repsData[exercise.id] ? parseInt(repsData[exercise.id]) : null
                    }))
                }))
            };
            await api.post("/training/assign-plan", planData, { withCredentials: true });
            console.log("Plan przypisany do użytkownika:", planData);
            setMessage("Plan został przypisany do użytkownika!");
            setTimeout(() => navigate('/trainingPlans'), 1500);
        } catch (err) {
            console.error("Błąd przypisywania planu:", err);
            setMessage("Błąd podczas przypisywania planu do użytkownika.");
        }
    };

    return (
        <div className="create-plan-page">
            <aside className="create-plan-left-full">
                
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
                                    <p className="exercise-name">
                                        {exerciseTemplates.find(t => String(t.id) === String(selectedTemplateId))?.name}
                                    </p>
                                    <p className="exercise-desc">
                                        {exerciseTemplates.find(t => String(t.id) === String(selectedTemplateId))?.description}
                                    </p>
                                    <h4 className="exercise-muscles-title">Mięśnie</h4>
                                    {templateMuscles.length > 0 ? (
                                        <ul className="exercise-muscles-list">
                                            {templateMuscles.map((tm) => (
                                                <li key={tm.id} className="muscle-chip">
                                                    <span className="muscle-name">{tm.muscleName}</span>
                                                    <span className="muscle-intensity">{tm.intensity}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="exercise-no-data">Brak danych</p>
                                    )}
                                </div>
                            )}

            </aside>

            {/* RIGHT: dni / tygodnie / edycja */}
            <main className="create-plan-right-full">
                <div className="days-header-row">
                    <input 
                        type="text"
                        className="plan-title-input"
                        placeholder="Tytuł planu treningowego"
                        value={planTitle}
                        onChange={(e) => setPlanTitle(e.target.value)}
                    />
                    {user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_COACH' ? (
                        <input 
                            type="email"
                            className="plan-title-input"
                            placeholder="Email użytkownika (opcjonalnie)"
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                        />
                    ) : null}
                    <button className="add-day-btn" onClick={addTrainingDay}>
                        + Dodaj dzień
                    </button>
                </div>
                <div className="plan-canvas">
                    {planDays.length === 0 ? (
                        <div className="day-exercise-container empty">
                            <p style={{ marginBottom: "0.75rem" }}>Brak dni treningowych.</p>
                            <button className="add-exercise-to-day-btn" onClick={addTrainingDay}>
                                + Dodaj pierwszy dzień
                            </button>
                        </div>
                    ) : (
                        planDays.map((day, dayIdx) => (
                            <div key={day.id} className={`day-exercise-container ${day.exercises.length === 0 ? 'empty' : ''}`}>
                                <div className="day-header-large" onClick={() => setSelectedDayIndex(dayIdx)}>
                                    <span>Dzień {day.dayNumber}</span>
                                    <button 
                                        className="remove-day-btn-large" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeTrainingDay(dayIdx);
                                        }}
                                    >
                                        ✕
                                    </button>
                                </div>

                                {day.exercises.length > 0 ? (
                                    <div className="exercises-in-day">
                                        {day.exercises.map((ex, exIdx) => (
                                            <div key={ex.id} className="exercise-in-day-card">
                                                <div className="exercise-in-day-info">
                                                    <div className="exercise-in-day-name">{ex.name}</div>
                                                    <div className="exercise-in-day-inputs">
                                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                            <span style={{ fontSize: '0.8rem' }}>Serie:</span>
                                                            <input 
                                                                type="number" 
                                                                min="1" 
                                                                placeholder="3" 
                                                                className="exercise-in-day-input"
                                                                value={seriesData[ex.id] || ''}
                                                                onChange={(e) => setSeriesData({...seriesData, [ex.id]: e.target.value})}
                                                            />
                                                        </label>
                                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                            <span style={{ fontSize: '0.8rem' }}>Powtórz:</span>
                                                            <input 
                                                                type="number" 
                                                                min="1" 
                                                                placeholder="10" 
                                                                className="exercise-in-day-input"
                                                                value={repsData[ex.id] || ''}
                                                                onChange={(e) => setRepsData({...repsData, [ex.id]: e.target.value})}
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                                <button
                                                    className="remove-ex-btn-large"
                                                    onClick={() => removeExerciseFromDay(dayIdx, exIdx)}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>Brak ćwiczeń w tym dniu</p>
                                )}

                                {selectedTemplateId && selectedDayIndex === dayIdx && (
                                    <button 
                                        className="add-exercise-to-day-btn"
                                        onClick={addExerciseToDay}
                                    >
                                        + Dodaj ćwiczenie
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                    </div>

                    {user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_COACH' ? (
                        <div className="coach-buttons-row">
                            <button 
                                className="save-plan-btn"
                                onClick={handleSavePlan}
                            >
                                Zapisz plan
                            </button>
                            <button 
                                className="assign-plan-btn"
                                onClick={handleAssignPlan}
                            >
                                Przypisz plan do użytkownika
                            </button>
                        </div>
                    ) : (
                        <div>
                            <button 
                                className="save-plan-btn"
                                onClick={handleSavePlan}
                            >
                                Zapisz plan
                            </button>
                            <button 
                                className="assign-plan-btn"
                                onClick={handleAssignPlan}
                                style={{ marginTop: '1rem' }}
                            >
                                TEST: Przypisz plan (test COACH)
                            </button>
                        </div>
                    )}
                    {message && (
                        <div className="plan-message">{message}</div>
                    )}
                </main>
        </div>
    );
};

export default CreatePlanPage;
