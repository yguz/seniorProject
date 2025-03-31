import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import Dropdown from 'react-bootstrap/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { UserContext } from './context/UserContext.jsx';
import logo from './assets/logo2.png';

const Navbar = () => {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const loggedIn = !!user;
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsNavCollapsed(true);
  }, [location.pathname]);

  const handleLinkClick = () => {
    setIsNavCollapsed(true);
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-beige">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          <img src={logo} alt="Logo" className="navbar-logo" />
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
        <div className={`collapse navbar-collapse ${isNavCollapsed ? '' : 'show'}`} id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link to="/" className="nav-link animated-link" onClick={handleLinkClick}>
                Home <span className="hover-bar"></span>
              </Link>
            </li>
            <li className="nav-item dropdown-container">
              <Dropdown show={dropdownOpen} onToggle={() => setDropdownOpen(!dropdownOpen)}>
                <Dropdown.Toggle as="a" className="nav-link">
                  Meals
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/breakfast" onClick={() => setDropdownOpen(false)}>
                    Breakfast
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/lunch" onClick={() => setDropdownOpen(false)}>
                    Lunch
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/dinner" onClick={() => setDropdownOpen(false)}>
                    Dinner
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link animated-link" onClick={handleLinkClick}>
                About Us <span className="hover-bar"></span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className="nav-link animated-link" onClick={handleLinkClick}>
                Contact Us <span className="hover-bar"></span>
              </Link>
            </li>
            {loggedIn && (
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link animated-link" onClick={handleLinkClick}>
                  Dashboard <span className="hover-bar"></span>
                </Link>
              </li>
            )}
            {loggedIn ? (
              <li className="nav-item">
                <button className="nav-link animated-link" onClick={handleLogout}>
                  Logout <span className="hover-bar"></span>
                </button>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link animated-link" onClick={handleLinkClick}>
                    Login <span className="hover-bar"></span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link animated-link" onClick={handleLinkClick}>
                    Register <span className="hover-bar"></span>
                  </Link>
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
