import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import About from './About';
import Home from './Home';
import Contact from './Contact';
import Login from './Login';
import Register from './Register';
import SearchResults from './SearchResults';
import MealResults from './MealResults';
import { UserContext } from './context/UserContext.jsx';

const Navbar = () => {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const { user, setUser } = useContext(UserContext);
  const loggedIn = !!user;

  const handleLinkClick = () => {
    if (!isNavCollapsed) {
      setIsNavCollapsed(true);
    }
  };

  const handleLogout = () => {
    setUser(null);
    window.location.href = "/login";
  };

  useEffect(() => {
    const navbarCollapse = document.getElementById("navbarNav");
    if (navbarCollapse) {
      navbarCollapse.classList.remove("show");
    }
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-beige">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          <img src="src/assets/logo2.png" alt="Logo" className="navbar-logo" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded={!isNavCollapsed ? "true" : "false"}
          aria-label="Toggle navigation"
          onClick={() => setIsNavCollapsed(!isNavCollapsed)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isNavCollapsed ? "" : "show"}`} id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link to="/" className="nav-link" onClick={handleLinkClick}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <DropdownButton id="dropdown" title="Meals" className="nav-link">
                <Dropdown.Item as={Link} to="/breakfast" onClick={handleLinkClick}>
                  Breakfast
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/lunch" onClick={handleLinkClick}>
                  Lunch
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/dinner" onClick={handleLinkClick}>
                  Dinner
                </Dropdown.Item>
              </DropdownButton>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link" onClick={handleLinkClick}>
                About Us
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className="nav-link" onClick={handleLinkClick}>
                Contact Us
              </Link>
            </li>
            {loggedIn ? (
              <li className="nav-item">
                <button className="nav-link" onClick={handleLogout}>Logout</button>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link" onClick={handleLinkClick}>Login</Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link" onClick={handleLinkClick}>Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
