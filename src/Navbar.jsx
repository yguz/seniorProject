import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './Navbar.css';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import 'bootstrap/dist/css/bootstrap.min.css';
import About from './About';
import Home from './Home';
import Contact from './Contact';
import Login from './Login';
import Register from './Register';



const Navbar = () => {
  return (
    <BrowserRouter>
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
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link to="/" className="nav-link">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <DropdownButton id="dropdown" title="Meals" className="nav-link">
                  <Dropdown.Item as={Link} to="/breakfast">
                    Breakfast
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/lunch">
                    Lunch
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/dinner">
                    Dinner
                  </Dropdown.Item>
                </DropdownButton>
              </li>
              <li className="nav-item">
                <Link to="/about" className="nav-link">
                  About Us
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/contact" className="nav-link">
                  Contact Us
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/login" className="nav-link">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link">
                  Register
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* I need to work on this/}
        {/* <Route path="/breakfast" element={<div>Breakfast Recipes</div>} />
        <Route path="/lunch" element={<div>Lunch Recipes</div>} />
        <Route path="/dinner" element={<div>Dinner Recipes</div>} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default Navbar;
