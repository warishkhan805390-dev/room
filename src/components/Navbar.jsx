import { useState } from "react";
import "./Navbar.css";

export default function Navbar({ onPageChange, activePage, user, onLogout }) {
  const [open, setOpen] = useState(false);

  const handleNav = (page) => {
    onPageChange(page);
    setOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => handleNav("home")} style={{ cursor: "pointer" }}>
        Room<span>Rent</span>
      </div>
      <ul className={`nav-links ${open ? "active" : ""}`}>
        <li><a href="#" onClick={(e) => { e.preventDefault(); handleNav("home"); }} className={activePage === "home" ? "active-link" : ""}>Home</a></li>
        <li><a href="#" onClick={(e) => { e.preventDefault(); handleNav("rooms"); }} className={activePage === "rooms" ? "active-link" : ""}>Rooms</a></li>
        <li><a href="#" onClick={(e) => { e.preventDefault(); handleNav("contact"); }} className={activePage === "contact" ? "active-link" : ""}>Contact</a></li>
        {user ? (
          <>
            <li><span className="nav-user-badge">{user.name?.charAt(0).toUpperCase()}</span></li>
            <li>
              <a href="#" onClick={(e) => { e.preventDefault(); handleNav(user.role === "admin" ? "admin" : "dashboard"); }}>
                {user.role === "admin" ? "📊 Admin" : "📋 Dashboard"}
              </a>
            </li>
            <li>
              <a className="btn btn-outline btn-sm-nav" href="#" onClick={(e) => { e.preventDefault(); onLogout(); }}>
                Logout
              </a>
            </li>
          </>
        ) : (
          <li>
            <a className="btn btn-primary" href="#" onClick={(e) => { e.preventDefault(); handleNav("login"); }}>
              Sign In
            </a>
          </li>
        )}
      </ul>
      <div className="hamburger" onClick={() => setOpen(!open)}>
        <span></span><span></span><span></span>
      </div>
    </nav>
  );
}
