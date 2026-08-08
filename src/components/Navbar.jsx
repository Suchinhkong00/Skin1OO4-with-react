import { NavLink, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { cartCount } = useCart();
  const { currentUser, isAdmin, logout } = useAuth();

  const closeMenu = () => {
    const navMenu = document.getElementById("navMenu");
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
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <img
            src={logoSrc}
            alt="SKIN1004 Logo"
            className="logo-img"
            onError={(e) => (e.target.style.display = "none")}
          />
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMenu"
          aria-controls="navMenu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav ms-auto gap-1 align-items-lg-center">
            {isAdmin ? (
              <>
                {/* Admin users only see admin-relevant navigation */}
                <li className="nav-item">
                  <NavLink className={linkClass} to="/admin" onClick={closeMenu}>Dashboard</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={linkClass} to="/admin/messages" onClick={closeMenu}>Messages</NavLink>
                </li>
              </>
            ) : (
              <>
                {/* Customer / guest navigation, unchanged */}
                <li className="nav-item">
                  <NavLink className={linkClass} to="/" end onClick={closeMenu}>Home</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={linkClass} to="/about" onClick={closeMenu}>About</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={linkClass} to="/products" onClick={closeMenu}>Products</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={linkClass} to="/why-choose-us" onClick={closeMenu}>Why Choose Us</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={linkClass} to="/contact" onClick={closeMenu}>Contact</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={linkClass + " nav-cart-link"} to="/cart" onClick={closeMenu} aria-label="View Cart">
                    <i className="ri-shopping-cart-2-line"></i>
                    {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                  </NavLink>
                </li>
              </>
            )}

            {currentUser ? (
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  type="button"
                >
                  {currentUser.displayName || "Account"}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <NavLink className="dropdown-item" to="/profile" onClick={closeMenu}>
                      My Profile
                    </NavLink>
                  </li>

                  {/* Order History is only relevant for customers, not admins */}
                  {!isAdmin && (
                    <li>
                      <NavLink className="dropdown-item" to="/orders" onClick={closeMenu}>
                        Order History
                      </NavLink>
                    </li>
                  )}

                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>Logout</button>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <NavLink className={linkClass} to="/login" onClick={closeMenu}>Login</NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}