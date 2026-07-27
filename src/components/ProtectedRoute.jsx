import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

export default function ProtectedRoute({ children }) {
  const { currentUser, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) return <Loader label="Checking your session…" />;
  if (!currentUser) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}
