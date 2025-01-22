import React from 'react';
import './Navbar.css';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-beige">
      <div className="container-fluid">
        <a href="/" className="navbar-brand">
          <img src="src/assets/logo.png" alt="Logo" className="navbar-logo" />
        </a>
        
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
              <a className="nav-link" href="#Home">Home</a>
            </li>
            <li className="nav-item">
              <DropdownButton id="dropdown" title="Meals" className="nav-link">
                <Dropdown.Item href="#breakfast">Breakfast</Dropdown.Item>
                <Dropdown.Item href="#lunch">Lunch</Dropdown.Item>
                <Dropdown.Item href="#dinner">Dinner</Dropdown.Item>
              </DropdownButton>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#About Us">About Us</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#Contact Us">Contact Us</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
