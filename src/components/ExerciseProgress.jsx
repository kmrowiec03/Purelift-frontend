import React, { useEffect, useMemo, useState } from "react";
import { api } from "../api/axios";
import { useAuth } from "../actions/AuthContext.jsx";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import "../style/ExerciseProgress.css";

// Helper to format week labels like "2025-W50"
const formatWeekLabel = (year, week) => `${year}-W${week.toString().padStart(2, "0")}`;

const ExerciseProgress = () => {
  const { user } = useAuth();
  const [exerciseOptions, setExerciseOptions] = useState([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState(null);
  const [weeks, setWeeks] = useState(12);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Nowe state dla max weights
  const [maxWeights, setMaxWeights] = useState([]);
  const [maxWeightsLoading, setMaxWeightsLoading] = useState(false);
  const [repFilter, setRepFilter] = useState('all'); // 'all', '1', '3', '5'

  // Load recent exercises for selection
  useEffect(() => {
    const fetchRecentExercises = async () => {
      if (!user) return;
      try {
        const res = await api.get(`/metrics/recent-exercises`, { withCredentials: true });
        const list = Array.isArray(res.data) ? res.data : [];
        setExerciseOptions(list);
        if (list.length > 0) setSelectedExerciseId(list[0].id);
      } catch (err) {
        console.error("Błąd pobierania listy ćwiczeń:", err.response || err.message);
        setError("Nie udało się pobrać listy ćwiczeń.");
      }
    };
    fetchRecentExercises();
  }, [user]);

  // Load max weights when user changes
  useEffect(() => {
    const fetchMaxWeights = async () => {
      if (!user) return;
      setMaxWeightsLoading(true);
      try {
        const res = await api.get(`/metrics/max-weights`, { withCredentials: true });
        const weights = Array.isArray(res.data) ? res.data : [];
        setMaxWeights(weights);
      } catch (err) {
        console.error("Błąd pobierania maksymalnych ciężarów:", err.response || err.message);
      } finally {
        setMaxWeightsLoading(false);
      }
    };
    fetchMaxWeights();
  }, [user]);

  // Fetch weekly tonnage when selection changes
  useEffect(() => {
    const fetchSeries = async () => {
      if (!selectedExerciseId || weeks <= 0) return;
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/metrics/tonnage`, {
          params: { exerciseId: selectedExerciseId, weeks },
          withCredentials: true,
        });
        const series = Array.isArray(res.data) ? res.data : [];
        // Sort by ISO year/week ascending
        const sorted = series.slice().sort((a, b) => (a.year - b.year) || (a.week - b.week));
        // Expect items like { year: 2025, week: 50, tonnage: 4325 }
        const chartData = sorted.map((pt) => ({
          label: formatWeekLabel(pt.year, pt.week),
          tonnage: pt.tonnage ?? 0,
        }));
        setData(chartData);
      } catch (err) {
        console.error("Błąd pobierania metryk:", err.response || err.message);
        setError("Nie udało się pobrać metryk.");
      } finally {
        setLoading(false);
      }
    };
    fetchSeries();
  }, [selectedExerciseId, weeks]);

  const exerciseName = useMemo(() => {
    const found = exerciseOptions.find((e) => e.id === selectedExerciseId);
    return found?.name || "Ćwiczenie";
  }, [exerciseOptions, selectedExerciseId]);

  // Filter max weights based on rep filter
  const filteredMaxWeights = useMemo(() => {
    if (repFilter === 'all') return maxWeights;
    
    return maxWeights.filter(exercise => {
      switch (repFilter) {
        case '1':
          return exercise.maxWeight1Rep !== null;
        case '3':
          return exercise.maxWeight3Rep !== null;
        case '5':
          return exercise.maxWeight5Rep !== null;
        default:
          return true;
      }
    });
  }, [maxWeights, repFilter]);

  const getWeightForRep = (exercise, rep) => {
    switch (rep) {
      case '1':
        return exercise.maxWeight1Rep;
      case '3':
        return exercise.maxWeight3Rep;
      case '5':
        return exercise.maxWeight5Rep;
      default:
        return null;
    }
  };

  return (
    <div className="exercise-progress-page">
      <h1 className="exercise-progress-header">Analiza Postępów</h1>

      <div className="exercise-progress-container">
        {/* Lewa część - wykres tonażu */}
        <div className="chart-section">
          <h2 className="section-title">Tygodniowy Tonaż</h2>
          
          {/* Controls */}
          <div className="chart-controls">
            <select
              value={selectedExerciseId || ""}
              onChange={(e) => setSelectedExerciseId(parseInt(e.target.value))}
              className="exercise-select"
            >
              {exerciseOptions.map((ex) => (
                <option key={ex.id} value={ex.id}>{ex.name}</option>
              ))}
            </select>
            <select
              value={weeks}
              onChange={(e) => setWeeks(parseInt(e.target.value))}
              className="weeks-select"
            >
              {[7, 8, 10, 12, 16].map((w) => (
                <option key={w} value={w}>{w} tyg.</option>
              ))}
            </select>
          </div>

          {loading && <div className="loading-message">Ładowanie metryk...</div>}
          {error && <div className="error-message">{error}</div>}

          {!loading && !error && data.length > 0 && (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis tickFormatter={(v) => `${v} kg`} />
                  <Tooltip formatter={(v) => [`${v} kg`, exerciseName]} />
                  <Line type="monotone" dataKey="tonnage" stroke="#e67e22" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {!loading && !error && data.length === 0 && (
            <p className="no-data-message">Brak danych do wyświetlenia.</p>
          )}
        </div>

        {/* Prawa część - tabela maksymalnych ciężarów */}
        <div className="weights-section">
          <h2 className="section-title">Maksymalne Ciężary</h2>
          
          {/* Filter dla powtórzeń */}
          <div className="rep-filter">
            <label>Filtruj według powtórzeń:</label>
            <select 
              value={repFilter} 
              onChange={(e) => setRepFilter(e.target.value)}
              className="rep-select"
            >
              <option value="all">Wszystkie</option>
              <option value="1">1 RM</option>
              <option value="3">3 RM</option>
              <option value="5">5 RM</option>
            </select>
          </div>

          {maxWeightsLoading && <div className="loading-message">Ładowanie maksymalnych ciężarów...</div>}

          {!maxWeightsLoading && filteredMaxWeights.length > 0 && (
            <div className="weights-table-container">
              <table className="weights-table">
                <thead>
                  <tr>
                    <th>Ćwiczenie</th>
                    {(repFilter === 'all' || repFilter === '1') && <th>1 RM (kg)</th>}
                    {(repFilter === 'all' || repFilter === '3') && <th>3 RM (kg)</th>}
                    {(repFilter === 'all' || repFilter === '5') && <th>5 RM (kg)</th>}
                    {repFilter !== 'all' && <th>Ciężar (kg)</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredMaxWeights.map((exercise, index) => (
                    <tr key={index}>
                      <td className="exercise-name" title={exercise.exerciseDescription}>
                        {exercise.exerciseName}
                      </td>
                      {repFilter === 'all' ? (
                        <>
                          <td className="weight-value">
                            {exercise.maxWeight1Rep ? `${exercise.maxWeight1Rep}` : '-'}
                          </td>
                          <td className="weight-value">
                            {exercise.maxWeight3Rep ? `${exercise.maxWeight3Rep}` : '-'}
                          </td>
                          <td className="weight-value">
                            {exercise.maxWeight5Rep ? `${exercise.maxWeight5Rep}` : '-'}
                          </td>
                        </>
                      ) : (
                        <td className="weight-value">
                          {getWeightForRep(exercise, repFilter) || '-'}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!maxWeightsLoading && filteredMaxWeights.length === 0 && (
            <p className="no-data-message">
              {repFilter === 'all' ? 'Brak danych o maksymalnych ciężarach.' : `Brak ćwiczeń z ${repFilter} powtórzeniem.`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExerciseProgress;