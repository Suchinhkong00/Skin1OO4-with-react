import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import BackToTop from "./BackToTop";

// Separate shell for /admin/... pages. Deliberately does NOT render the
// public-site Footer — the admin area should feel like its own dashboard,
// not a page within the customer storefront. Navbar is reused as-is since
// it already renders admin-only links (Dashboard, Messages) instead of the
// customer nav whenever the logged-in user's role is admin.
export default function AdminLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <BackToTop />
    </>
  );
}