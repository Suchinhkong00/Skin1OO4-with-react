import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      toast.success("Welcome back!");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(friendlyAuthError(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="py-5 auth-section">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="auth-card">
              <span className="section-tag">Welcome Back</span>
              <h3 className="fw-bold mt-2 mb-4">Log In to SKIN1004</h3>
              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    type="email" id="email" className="form-control" required
                    value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password" id="password" className="form-control" required
                    value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                </div>
                <div className="d-flex justify-content-end mb-3">
                  <Link to="/forgot-password" className="small">Forgot password?</Link>
                </div>
                <button type="submit" className="btn btn-primary btn-lg w-100 rounded-pill" disabled={submitting}>
                  {submitting ? "Logging in…" : "Log In"}
                </button>
              </form>
              <p className="text-center text-muted mt-4 mb-0">
                Don't have an account? <Link to="/register">Create one</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function friendlyAuthError(err) {
  const code = err?.code || "";
  if (code.includes("user-not-found") || code.includes("invalid-credential")) return "No account matches those details.";
  if (code.includes("wrong-password")) return "Incorrect password.";
  if (code.includes("email-already-in-use")) return "An account with that email already exists.";
  if (code.includes("weak-password")) return "Password should be at least 6 characters.";
  if (code.includes("invalid-email")) return "Enter a valid email address.";
  return "Something went wrong. Please try again.";
}
