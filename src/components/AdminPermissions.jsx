import React, { useEffect, useState } from "react";
import { api } from "../api/axios";
import { useAuth } from "../actions/AuthContext.jsx";
import "../style/AdminPermissions.css";

const AdminPermissions = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState(["ROLE_USER", "ROLE_COACH", "ROLE_ADMIN"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (user?.role !== "ROLE_ADMIN") {
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      try {
        // Pobierz dostępne role z backendu lub użyj domyślnych
        try {
          const rolesRes = await api.get("/roles", { withCredentials: true });
          if (Array.isArray(rolesRes.data) && rolesRes.data.length) {
            setRoles(rolesRes.data);
          }
        } catch (_) { 
          // Fallback do domyślnych ról jeśli endpoint nie istnieje
          console.log("Używam domyślnych ról");
        }

        const usersRes = await api.get(`/users`, {
          params: { search },
          withCredentials: true,
        });
        setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
      } catch (err) {
        console.error("Błąd pobierania użytkowników:", err.response || err.message);
        setError("Nie udało się pobrać użytkowników.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.role, search]);

  const handleRoleChange = async (id, role) => {
    if (!role) return;
    setUpdatingId(id);
    try {
      await api.put(`/users/${id}/role`, { role }, { withCredentials: true });
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    } catch (err) {
      console.error("Błąd aktualizacji roli:", err.response || err.message);
      alert("Nie udało się zaktualizować uprawnień.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (user?.role !== "ROLE_ADMIN") {
    return <div className="admin-error-message">Strona dostępna tylko dla administratora.</div>;
  }
  if (loading) return <div className="admin-loading-message">Ładowanie uprawnień...</div>;
  if (error) return <div className="admin-error-message">{error}</div>;

  return (
    <div className="admin-permissions-page">
      <h1 className="admin-permissions-header">Uprawnienia użytkowników</h1>

      <div className="admin-permissions-container">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Szukaj po emailu lub nazwie..."
          className="admin-search-bar"
        />

        {users.length === 0 ? (
          <div className="admin-no-users-message">Brak użytkowników do wyświetlenia.</div>
        ) : (
          <div className="admin-users-grid">
            {users.map((u) => {
              const statusClass = !u.enabled ? 'inactive' : u.locked ? 'locked' : 'active';
              const statusText = !u.enabled ? 'Nieaktywny' : u.locked ? 'Zablokowany' : 'Aktywny';
              
              return (
                <div className="admin-user-card" key={u.id}>
                  <div className="admin-user-avatar">
                    {u.name?.[0] || u.email?.[0]?.toUpperCase() || "?"}
                  </div>
                  
                  <h3 className="admin-user-name">
                    {u.name && u.lastname ? `${u.name} ${u.lastname}` : u.email}
                  </h3>
                  
                  <p className="admin-user-email">{u.email}</p>
                  
                  <div className="admin-user-info">
                    {u.trainingPlanTitles && u.trainingPlanTitles.length > 0 && (
                      <div className="admin-user-plans">
                        {u.trainingPlanTitles.length} planów
                      </div>
                    )}
                    <div className={`admin-user-status ${statusClass}`}>
                      {statusText}
                    </div>
                  </div>

                  <div className="admin-role-section">
                    <label className="admin-role-label">Rola użytkownika</label>
                    <select
                      value={u.role || "ROLE_USER"}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      disabled={updatingId === u.id}
                      className="admin-role-select"
                    >
                      {roles.map((r) => (
                        <option key={r} value={r}>{r.replace('ROLE_', '')}</option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPermissions;
