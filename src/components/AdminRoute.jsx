import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

export default function AdminRoute({ children }) {
  const { currentUser, isAdmin, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) return <Loader label="Checking permissions…" />;
  if (!currentUser) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}
