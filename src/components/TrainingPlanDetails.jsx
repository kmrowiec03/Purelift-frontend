import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from '../api/axios';
import "/src/style/TrainingPlanDetails.css";
import "/src/style/App.css";

const TrainingPlanDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedWeeks, setExpandedWeeks] = useState([]);
    const [weights, setWeights] = useState({});
    const [sets, setSets] = useState({});
    const [reps, setReps] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [originalSets, setOriginalSets] = useState({});
    const [originalReps, setOriginalReps] = useState({});
    const [originalWeights, setOriginalWeights] = useState({});
    const [showMenu, setShowMenu] = useState(false);
    const [weightsDisabled, setWeightsDisabled] = useState({});

    useEffect(() => {
        api.get(`/training/${id}`, { withCredentials: true })
            .then((response) => {
                console.log("Training days:", response.data.trainingDays.map(d => ({ id: d.id, weekNumber: d.weekNumber, dayNumber: d.dayNumber })));
                setPlan(response.data);
                const initialWeights = {};
                const initialSets = {};
                const initialReps = {};
                response.data.trainingDays.forEach(day => {
                    day.exercises.forEach(ex => {
                        initialWeights[ex.id] = ex.weight;
                        initialSets[ex.id] = ex.sets;
                        initialReps[ex.id] = ex.reps;
                    });
                });
                setWeights(initialWeights);
                setSets(initialSets);
                setReps(initialReps);
                setOriginalSets({...initialSets});
                setOriginalReps({...initialReps});
                setOriginalWeights({...initialWeights});
                const initialDisabled = {};
                Object.keys(initialWeights).forEach(exId => {
                    initialDisabled[exId] = initialWeights[exId] != null && initialWeights[exId] !== "";
                });
                setWeightsDisabled(initialDisabled);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Błąd podczas pobierania planu:", error);
                setLoading(false);
            });
    }, [id]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showMenu && !event.target.closest('.menu-container')) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showMenu]);

    const toggleWeek = (weekNum) => {
        setExpandedWeeks((prev) =>
            prev.includes(weekNum) ? prev.filter((w) => w !== weekNum) : [...prev, weekNum]
        );
    };

    const handleWeightChange = (exerciseId, value) => {
        setWeights(prev => ({ ...prev, [exerciseId]: value }));
        if (value === "" || value == null) {
            setWeightsDisabled(prev => ({ ...prev, [exerciseId]: false }));
        }
    };

    const handleSetsChange = (exerciseId, value) => {
        setSets(prev => ({ ...prev, [exerciseId]: value }));
    };

    const handleRepsChange = (exerciseId, value) => {
        setReps(prev => ({ ...prev, [exerciseId]: value }));
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/training/${id}`, { withCredentials: true });
            setShowMenu(false);
            navigate('/trainingPlans'); // Przekierowanie do listy planów
        } catch (error) {
            console.error("Błąd podczas usuwania planu:", error);
            alert("Błąd podczas usuwania planu");
            setShowMenu(false);
        }
    };

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const toggleEdit = () => {
        const newEditMode = !editMode;
        setEditMode(newEditMode);
        setShowMenu(false);
    };

    const saveWeight = async (exerciseId) => {
        const weight = parseFloat(weights[exerciseId]);
        if (isNaN(weight)) {
            alert("Nieprawidłowa wartość");
            return;
        }
        try {
            await api.put(`/training/exercise/${exerciseId}`, { weight }, { withCredentials: true });
            setOriginalWeights(prev => ({ ...prev, [exerciseId]: weight }));
            setWeightsDisabled(prev => ({ ...prev, [exerciseId]: true }));
        } catch (error) {
            alert("Błąd podczas zapisywania kilogramu");
        }
    };

    const toggleWeightEdit = (exerciseId) => {
        setWeightsDisabled(prev => ({ ...prev, [exerciseId]: false }));
    };

    const completeExercise = async (exerciseId) => {
        try {
            console.log(`Completing exercise ${exerciseId}`);
            await api.put(`/training/exercise/${exerciseId}/completion`, { completed: true }, { withCredentials: true });
            // Odśwież dane
            const response = await api.get(`/training/${id}`, { withCredentials: true });
            setPlan(response.data);
            console.log("Plan refreshed after completion");
        } catch (error) {
            console.error("Error completing exercise:", error);
            alert("Błąd podczas oznaczania ćwiczenia jako ukończone");
        }
    };

    const uncompleteExercise = async (exerciseId) => {
        try {
            console.log(`Uncompleting exercise ${exerciseId}`);
            await api.put(`/training/exercise/${exerciseId}/completion`, { completed: false }, { withCredentials: true });
            // Odśwież dane
            const response = await api.get(`/training/${id}`, { withCredentials: true });
            setPlan(response.data);
            console.log("Plan refreshed after uncompletion");
        } catch (error) {
            console.error("Error uncompleting exercise:", error);
            alert("Błąd podczas odznaczania ćwiczenia");
        }
    };

    const applyChanges = async () => {
        const changes = {};
        Object.keys(sets).forEach(exerciseId => {
            const setsValue = parseInt(sets[exerciseId]);
            if (!isNaN(setsValue) && setsValue > 0 && setsValue !== originalSets[exerciseId]) {
                if (!changes[exerciseId]) changes[exerciseId] = {};
                changes[exerciseId].sets = setsValue;
            }
        });
        Object.keys(reps).forEach(exerciseId => {
            const repsValue = parseInt(reps[exerciseId]);
            if (!isNaN(repsValue) && repsValue > 0 && repsValue !== originalReps[exerciseId]) {
                if (!changes[exerciseId]) changes[exerciseId] = {};
                changes[exerciseId].reps = repsValue;
            }
        });
        Object.keys(weights).forEach(exerciseId => {
            const weight = parseFloat(weights[exerciseId]);
            if (!isNaN(weight) && weight !== originalWeights[exerciseId]) {
                if (!changes[exerciseId]) changes[exerciseId] = {};
                changes[exerciseId].weight = weight;
            }
        });

        const promises = Object.keys(changes).map(exerciseId =>
            api.put(`/training/exercise/${exerciseId}`, changes[exerciseId], { withCredentials: true })
        );

        console.log(`Total promises: ${promises.length}`);
        if (promises.length === 0) {
            alert("Brak zmian do zapisania!");
            return;
        }
        try {
            await Promise.all(promises);
            console.log("All promises resolved");
            // Odśwież dane z bazy
            const response = await api.get(`/training/${id}`, { withCredentials: true });
            setPlan(response.data);
            const initialWeights = {};
            const initialSets = {};
            const initialReps = {};
            response.data.trainingDays.forEach(day => {
                day.exercises.forEach(ex => {
                    initialWeights[ex.id] = ex.weight;
                    initialSets[ex.id] = ex.sets;
                    initialReps[ex.id] = ex.reps;
                });
            });
            setWeights(initialWeights);
            setSets(initialSets);
            setReps(initialReps);
            setOriginalSets({...initialSets});
            setOriginalReps({...initialReps});
            setOriginalWeights({...initialWeights});
            setEditMode(false);
        } catch (error) {
            console.error("Error:", error);
            alert("Błąd podczas zapisywania zmian");
        }
    };

    if (loading) return <p>Ładowanie...</p>;
    if (!plan) return <p>Nie znaleziono planu.</p>;

    return (
        <div className="training-plan-details">
            <div className="details-header">
                <h2 className="plan-title">Plan treningowy: {plan.title} {editMode && "(Edycja)"}</h2>
                {editMode && <button className="apply-button" onClick={applyChanges}>Zastosuj</button>}
                <div className="menu-container">
                    <button className="menu-button" onClick={toggleMenu}>⋮</button>
                    {showMenu && (
                        <div className="menu-dropdown">
                            <button className="menu-item" onClick={toggleEdit}>Edytuj</button>
                            <button className="menu-item" onClick={handleDelete}>Usuń</button>
                        </div>
                    )}
                </div>
            </div>

            <div className="weeks-section">
                {plan.trainingDays?.length > 0 ? (
                    <div className="weeks-list">
                        {Object.entries(
                            plan.trainingDays.reduce((weeks, day) => {
                                const weekNum = day.weekNumber || 1;
                                if (!weeks[weekNum]) weeks[weekNum] = [];
                                weeks[weekNum].push(day);
                                return weeks;
                            }, {})
                        ).map(([weekNum, days]) => (
                            <div key={weekNum} className="week-item">
                                <button className="week-btn" onClick={() => toggleWeek(weekNum)}>
                                    Tydzień {weekNum} {expandedWeeks.includes(weekNum) ? "▲" : "▼"}
                                </button>
                                
                                {expandedWeeks.includes(weekNum) && (
                                    <div className="days-columns">
                                        {days.map((day) => (
                                            <div key={day.id} className="day-column">
                                                <h4 className="day-header">Dzień {day.dayNumber}</h4>
                                                <div className="exercises-list">
                                                    {day.exercises && day.exercises.length > 0 ? (
                                                        <ul>
                                                            {day.exercises.map((exercise) => (
                                                                <li key={exercise.id}>
                                                                    <strong>{exercise.exerciseName}</strong>
                                                                    <div className="exercise-details">
                                                                        {editMode ? (
                                                                            <>
                                                                                <label>Serie: 
                                                                                    <input
                                                                                        type="number"
                                                                                        min="1"
                                                                                        value={sets[exercise.id] ?? ""}
                                                                                        onChange={(e) => handleSetsChange(exercise.id, e.target.value)}
                                                                                    />
                                                                                </label>
                                                                                <label>Powtórzenia: 
                                                                                    <input
                                                                                        type="number"
                                                                                        min="1"
                                                                                        value={reps[exercise.id] ?? ""}
                                                                                        onChange={(e) => handleRepsChange(exercise.id, e.target.value)}
                                                                                    />
                                                                                </label>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <span>Serie: {exercise.sets}</span>
                                                                                <span>Powtórzenia: {exercise.reps}</span>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                    {exercise.completedDate && (
                                                                        <span className="completed-date">
                                                                            Ukończone: {new Date(exercise.completedDate).toLocaleDateString()}
                                                                        </span>
                                                                    )}
                                                                    <div className="weight-controls">
                                                                        <input
                                                                            type="number"
                                                                            step="0.1"
                                                                            value={weights[exercise.id] ?? ""}
                                                                            onChange={(e) => handleWeightChange(exercise.id, e.target.value)}
                                                                            disabled={weightsDisabled[exercise.id] || false}
                                                                            placeholder="kg"
                                                                        />
                                                                        <span>kg</span>
                                                                        {!exercise.completedDate ? (
                                                                            <button 
                                                                                className="save-weight-btn" 
                                                                                onClick={weightsDisabled[exercise.id] ? () => toggleWeightEdit(exercise.id) : async () => {
                                                                                    await saveWeight(exercise.id);
                                                                                    await completeExercise(exercise.id);
                                                                                }}
                                                                            >
                                                                                {weightsDisabled[exercise.id] ? "Edit" : "Save & Complete"}
                                                                            </button>
                                                                        ) : (
                                                                            <button 
                                                                                className="save-weight-btn" 
                                                                                onClick={weightsDisabled[exercise.id] ? () => toggleWeightEdit(exercise.id) : async () => {
                                                                                    await saveWeight(exercise.id);
                                                                                    await completeExercise(exercise.id); // Aktualizuj datę ukończenia
                                                                                }}
                                                                            >
                                                                                {weightsDisabled[exercise.id] ? "Edit" : "Save"}
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <p className="no-exercises">Brak ćwiczeń</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Brak dni treningowych.</p>
                )}
            </div>
        </div>
    );
};

export default TrainingPlanDetails;
