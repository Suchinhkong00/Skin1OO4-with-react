import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { friendlyAuthError } from "./Login";

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await resetPassword(email);
      setSent(true);
      toast.success("Password reset email sent.");
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
              <span className="section-tag">Account Recovery</span>
              <h3 className="fw-bold mt-2 mb-3">Reset Your Password</h3>
              {sent ? (
                <p className="text-muted">
                  If an account exists for <strong>{email}</strong>, a reset link is on its way. Check your inbox
                  (and spam folder).
                </p>
              ) : (
                <>
                  <p className="text-muted mb-4">Enter your email and we'll send you a reset link.</p>
                  <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email Address</label>
                      <input
                        type="email" id="email" className="form-control" required
                        value={email} onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg w-100 rounded-pill" disabled={submitting}>
                      {submitting ? "Sending…" : "Send Reset Link"}
                    </button>
                  </form>
                </>
              )}
              <p className="text-center text-muted mt-4 mb-0">
                <Link to="/login">Back to Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
