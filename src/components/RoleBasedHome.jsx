import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";
import Home from "../pages/Home";

// Sits specifically at the "/" route. Redirects an authenticated admin
// straight to /admin instead of showing the public Home page — covers both
// landing on "/" right after login, and navigating to "/" directly while
// already signed in as an admin. Customers and logged-out visitors see the
// normal Home page, unchanged.
export default function RoleBasedHome() {
  const { isAdmin, authLoading } = useAuth();

  if (authLoading) return <Loader label="Loading…" />;
  if (isAdmin) return <Navigate to="/admin" replace />;
  return <Home />;
}