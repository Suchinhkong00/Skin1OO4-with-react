import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { toast } from "react-toastify";
import { db, auth } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

function formatDate(timestamp) {
  if (!timestamp?.toDate) return "—";
  return timestamp.toDate().toLocaleDateString(undefined, {
    year: "numeric", month: "long", day: "numeric",
  });
}

export default function Profile() {
  const { currentUser, role, refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [createdAt, setCreatedAt] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!currentUser) return;
    let cancelled = false;
    setLoading(true);
    getDoc(doc(db, "users", currentUser.uid))
      .then((snap) => {
        if (cancelled) return;
        const data = snap.exists() ? snap.data() : {};
        setForm({
          name: data.name || currentUser.displayName || "",
          phone: data.phone || "",
        });
        setCreatedAt(data.createdAt || null);
      })
      .catch(() => {
        if (!cancelled) toast.error("Failed to load your profile.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [currentUser]);

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = "Full name is required.";
    if (form.phone && !/^[\d+\-\s()]{6,}$/.test(form.phone.trim())) {
      next.phone = "Enter a valid phone number.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const name = form.name.trim();
      const phone = form.phone.trim();

      await updateProfile(auth.currentUser, { displayName: name });
      await updateDoc(doc(db, "users", currentUser.uid), {
        name,
        phone,
        updatedAt: serverTimestamp(),
      });
      await refreshUser();

      toast.success("Profile updated.");
    } catch {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (!currentUser || loading) return <Loader label="Loading your profile…" />;

  return (
    <>
      <div className="page-banner">
        <div className="container">
          <h1>Your <span style={{ color: "#a8d5b5" }}>Profile</span></h1>
          <p>Manage your account details.</p>
        </div>
      </div>

      <section className="py-5">
        <div className="container py-4">
          <div className="row g-4 justify-content-center">
            <div className="col-lg-7">
              <span className="section-tag">Account</span>
              <h3 className="fw-bold mt-2 mb-4">Personal Information</h3>

              <form onSubmit={handleSubmit} noValidate>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text" className="form-control"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    {errors.name && <div className="form-msg error mt-1">{errors.name}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Phone Number <span className="text-muted fw-normal">(optional)</span></label>
                    <input
                      type="tel" className="form-control" placeholder="+855 12 345 678"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                    {errors.phone && <div className="form-msg error mt-1">{errors.phone}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" value={currentUser.email} disabled readOnly />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Account Type</label>
                    <input
                      type="text" className="form-control"
                      value={role === "admin" ? "Administrator" : "Customer"}
                      disabled readOnly
                    />
                  </div>
                </div>

                <p className="text-muted small mt-3 mb-4">Member since {formatDate(createdAt)}</p>

                <button type="submit" className="btn btn-primary btn-lg rounded-pill px-5" disabled={saving}>
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}