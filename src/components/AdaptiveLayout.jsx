import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "./Navbar";
import AdminNavbar from "./AdminNavbar";
import Footer from "./Footer";
import BackToTop from "./BackToTop";

// For routes shared by both customers and admins (currently just /profile).
// Renders the matching navbar/footer combo based on role, so an admin sees
// the consistent AdminNavbar (no public Footer) even here, instead of
// falling back to the customer Navbar just because the page itself is shared.
export default function AdaptiveLayout() {
  const { isAdmin } = useAuth();

  if (isAdmin) {
    return (
      <>
        <AdminNavbar />
        <main>
          <Outlet />
        </main>
        <BackToTop />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}