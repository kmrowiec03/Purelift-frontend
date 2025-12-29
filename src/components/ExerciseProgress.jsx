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

  return (
    <div className="clients-page">
      <h1 className="clients-header">Postęp: tygodniowy tonaż</h1>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: 20 }}>
        {/* Controls */}
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <select
            value={selectedExerciseId || ""}
            onChange={(e) => setSelectedExerciseId(parseInt(e.target.value))}
            style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
          >
            {exerciseOptions.map((ex) => (
              <option key={ex.id} value={ex.id}>{ex.name}</option>
            ))}
          </select>
          <select
            value={weeks}
            onChange={(e) => setWeeks(parseInt(e.target.value))}
            style={{ width: 140, padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
          >
            {[7, 8, 10, 12, 16].map((w) => (
              <option key={w} value={w}>{w} tyg.</option>
            ))}
          </select>
        </div>

        {loading && <div className="loading-message">Ładowanie metryk...</div>}
        {error && <div className="error-message">{error}</div>}

        {!loading && !error && data.length > 0 && (
          <div style={{ width: "100%", height: 360 }}>
            <ResponsiveContainer>
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
          <p className="no-clients-message">Brak danych do wyświetlenia.</p>
        )}
      </div>
    </div>
  );
};

export default ExerciseProgress;