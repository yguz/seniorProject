import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (

<nav className="navbar">
  <div className="navbar-left">
    <a href="/" className="logo">
      On-a-Budget Meals
    </a>
  </div>
  <div className="navbar-center">
      <ul className='nav-links'>
          <li><a href="#Home">Home</a></li>
          {/* <li class="dropdown">
            <a href="#Meals" class="dropbtn">Meals</a>
            <div class="dropdown-content">
              <a href="#breakfast">Breakfast</a>
              <a href="#lunch">Lunch</a>
              <a href="#dinner">Dinner</a>
            </div>
          </li> */}
          <li><a href="#About Us">About Us</a></li>
          <li><a href="#Contact Us">Contact Us</a></li>
      </ul>
  </div>
</nav>
);
};

export default Navbar;