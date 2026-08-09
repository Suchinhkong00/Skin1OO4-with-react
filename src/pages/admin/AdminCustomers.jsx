import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/Loader";

function formatDate(timestamp) {
  if (!timestamp?.toDate) return "—";
  return timestamp.toDate().toLocaleDateString(undefined, {
    year: "numeric", month: "short", day: "numeric",
  });
}

export default function AdminCustomers() {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    // No where() clause — admins can list every user document, since your
    // Firestore rule (`allow read: if ... || isAdmin()`) is evaluated per
    // document and passes for isAdmin() regardless of whose doc it is.
    const unsubscribe = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        setUsers(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (error) => {
        console.error("Failed to load customers:", error);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      const matchesQuery =
        !q ||
        (u.name || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q);
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      return matchesQuery && matchesRole;
    });
  }, [users, query, roleFilter]);

  async function handleToggleRole(user) {
    const nextRole = user.role === "admin" ? "customer" : "admin";
    const verb = nextRole === "admin" ? "promote" : "demote";
    if (!window.confirm(`Are you sure you want to ${verb} ${user.name || user.email} to ${nextRole}?`)) return;

    setUpdatingId(user.id);
    try {
      await updateDoc(doc(db, "users", user.id), { role: nextRole });
      toast.success(`${user.name || user.email} is now a ${nextRole}.`);
    } catch {
      toast.error("Failed to update role.");
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) return <Loader label="Loading customers…" />;

  return (
    <section className="py-5 admin-dashboard">
      <div className="container py-4">
        <div className="mb-4">
          <span className="section-tag">Admin</span>
          <h2 className="fw-bold mt-2 mb-0">Customers</h2>
          <p className="text-muted mb-0">{users.length} registered account{users.length !== 1 && "s"}</p>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-md-7">
            <div className="search-input-wrap">
              <i className="ri-search-line"></i>
              <input
                type="search" className="form-control" placeholder="Search by name or email…"
                value={query} onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-5">
            <select className="form-control" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="all">All Roles</option>
              <option value="customer">Customers</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state text-center py-5">
            <i className="ri-group-line"></i>
            <h4 className="mt-3">No customers found</h4>
            <p className="text-muted">Try a different search or filter.</p>
          </div>
        ) : (
          <div className="table-responsive admin-table-wrap">
            <table className="table align-middle admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => {
                  const isSelf = u.id === currentUser?.uid;
                  return (
                    <tr key={u.id}>
                      <td>{u.name || "—"}</td>
                      <td>{u.email || "—"}</td>
                      <td>{u.phone || "—"}</td>
                      <td>
                        <span className={"product-badge" + (u.role === "admin" ? " new" : "")} style={{ position: "static" }}>
                          {u.role === "admin" ? "Admin" : "Customer"}
                        </span>
                      </td>
                      <td>{formatDate(u.createdAt)}</td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-primary rounded-pill"
                          disabled={isSelf || updatingId === u.id}
                          title={isSelf ? "You can't change your own role here." : undefined}
                          onClick={() => handleToggleRole(u)}
                        >
                          {updatingId === u.id ? "Updating…" : u.role === "admin" ? "Demote to Customer" : "Promote to Admin"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}