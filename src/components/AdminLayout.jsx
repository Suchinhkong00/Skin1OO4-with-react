import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import BackToTop from "./BackToTop";

export default function AdminLayout() {
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