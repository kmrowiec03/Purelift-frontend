import React, { useEffect, useState } from "react";
import { api } from "../api/axios";
import { useAuth } from "../actions/AuthContext.jsx";
import "../style/PageBreak.css";

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
        // Optional: fetch available roles from backend
        try {
          const rolesRes = await api.get("/admin/roles", { withCredentials: true });
          if (Array.isArray(rolesRes.data) && rolesRes.data.length) {
            setRoles(rolesRes.data);
          }
        } catch (_) { /* fallback to default roles */ }

        const usersRes = await api.get(`/admin/users`, {
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
      await api.put(`/admin/users/${id}/role`, { role }, { withCredentials: true });
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    } catch (err) {
      console.error("Błąd aktualizacji roli:", err.response || err.message);
      alert("Nie udało się zaktualizować uprawnień.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (user?.role !== "ROLE_ADMIN") {
    return <div className="error-message">Strona dostępna tylko dla administratora.</div>;
  }
  if (loading) return <div className="loading-message">Ładowanie uprawnień...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="clients-page">
      <h1 className="clients-header">Uprawnienia użytkowników</h1>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Szukaj po emailu lub nazwie..."
          style={{ width: "100%", padding: 10, marginBottom: 20, border: "1px solid #ccc", borderRadius: 8 }}
        />

        {users.length === 0 ? (
          <p className="no-clients-message">Brak użytkowników do wyświetlenia.</p>
        ) : (
          <div className="requests-container" style={{ justifyContent: "flex-start" }}>
            {users.map((u) => (
              <div className="client-card" key={u.id} style={{ width: 360 }}>
                <div className="client-avatar">{u.firstName?.[0] || u.email?.[0]?.toUpperCase() || "?"}</div>
                <h3 className="client-name">{u.firstName && u.lastName ? `${u.firstName} ${u.lastName}` : u.email}</h3>
                <p className="client-email">{u.email}</p>

                <label style={{ marginTop: 10, width: "100%", textAlign: "left" }}>Rola</label>
                <select
                  value={u.role || "ROLE_USER"}
                  onChange={(e) => handleRoleChange(u.id, e.target.value)}
                  disabled={updatingId === u.id}
                  style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
                >
                  {roles.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPermissions;
