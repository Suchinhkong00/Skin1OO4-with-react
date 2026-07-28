import { NavLink, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { cartCount } = useCart();
  const { currentUser, isAdmin, logout } = useAuth();

  const linkClass = ({ isActive }) => "nav-link" + (isActive ? " active" : "");
  const logoSrc = `${import.meta.env.BASE_URL}images/Logo.png`;

  return (
    <nav className="navbar navbar-expand-lg fixed-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <img src={logoSrc} alt="SKIN1004 Logo" className="logo-img" onError={(e) => (e.target.style.display = "none")} />
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
            <li className="nav-item"><NavLink className={linkClass} to="/" end>Home</NavLink></li>
            <li className="nav-item"><NavLink className={linkClass} to="/about">About</NavLink></li>
            <li className="nav-item"><NavLink className={linkClass} to="/products">Products</NavLink></li>
            <li className="nav-item"><NavLink className={linkClass} to="/why-choose-us">Why Choose Us</NavLink></li>
            <li className="nav-item"><NavLink className={linkClass} to="/contact">Contact</NavLink></li>
            {isAdmin && (
              <li className="nav-item"><NavLink className={linkClass} to="/admin">Dashboard</NavLink></li>
            )}
            <li className="nav-item">
              <NavLink className={linkClass + " nav-cart-link"} to="/cart" aria-label="View cart">
                <i className="ri-shopping-cart-2-line"></i>
                <span className="cart-badge">{cartCount}</span>
              </NavLink>
            </li>
            {currentUser ? (
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle btn btn-link"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {currentUser.displayName || "Account"}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><NavLink className="dropdown-item" to="/orders">Order History</NavLink></li>
                  <li><button className="dropdown-item" onClick={logout}>Logout</button></li>
                </ul>
              </li>
            ) : (
              <li className="nav-item"><NavLink className={linkClass} to="/login">Login</NavLink></li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}