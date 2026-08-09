import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminNavbar() {
  const { currentUser, logout } = useAuth();

  const closeMenu = () => {
    const navMenu = document.getElementById("adminNavMenu");
    if (navMenu && navMenu.classList.contains("show") && window.bootstrap) {
      const collapse = window.bootstrap.Collapse.getOrCreateInstance(navMenu);
      collapse.hide();
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      closeMenu();
    } catch (err) {
      console.error(err);
    }
  };

  const linkClass = ({ isActive }) => "nav-link" + (isActive ? " active" : "");
  const logoSrc = `${import.meta.env.BASE_URL}images/Logo.png`;

  return (
    <nav className="navbar navbar-expand-lg fixed-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/admin">
          <img
            src={logoSrc}
            alt="SKIN1004 Logo"
            className="logo-img"
            onError={(e) => (e.target.style.display = "none")}
          />
          <span className="admin-brand-tag">Admin</span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#adminNavMenu"
          aria-controls="adminNavMenu"
          aria-expanded="false"
          aria-label="Toggle admin navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="adminNavMenu">
          <ul className="navbar-nav ms-auto gap-1 align-items-lg-center">
            <li className="nav-item">
              <NavLink className={linkClass} to="/admin" end onClick={closeMenu}>
                <i className="ri-price-tag-3-line me-1"></i> Products
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={linkClass} to="/admin/orders" onClick={closeMenu}>
                <i className="ri-file-list-3-line me-1"></i> Orders
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={linkClass} to="/admin/messages" onClick={closeMenu}>
                <i className="ri-mail-line me-1"></i> Messages
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={linkClass} to="/admin/customers" onClick={closeMenu}>
                <i className="ri-group-line me-1"></i> Customers
              </NavLink>
            </li>

            {/* Visually separated from the management links above */}
            <li className="nav-item dropdown admin-nav-account">
              <button
                className="nav-link dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                type="button"
              >
                <i className="ri-shield-user-line me-1"></i>
                {currentUser?.displayName || "Admin"}
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <NavLink className="dropdown-item" to="/profile" onClick={closeMenu}>
                    <i className="ri-user-line me-2"></i> My Profile
                  </NavLink>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    <i className="ri-logout-box-line me-2"></i> Logout
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}