import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="error-page">
      <div className="container text-center py-5">
        <span className="section-tag">404</span>
        <h1 className="fw-bold mt-2">Page Not Found</h1>
        <p className="text-muted">The page you're looking for doesn't exist or has moved.</p>
        <Link to="/" className="btn btn-primary rounded-pill px-4 mt-3">Back to Home</Link>
      </div>
    </div>
  );
}
