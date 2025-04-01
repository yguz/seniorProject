import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Navbar from './Navbar';
import About from './About';
import Home from './Home';
import Dashboard from './Dashboard';
import Contact from './Contact';
import Login from './Login';
import Register from './Register';
import SearchResults from './SearchResults';
import MealResults from './MealResults';
import ProtectedRoute from './context/ProtectedRoute';
import './App.css'; // Ensure you have a CSS file for transitions
import Chatbot from './Chatbot';

const App = () => {
  const location = useLocation(); // Get the current route location

  return (
    <div className="app-container">
      <Navbar /> {/* Navbar always at the top */}

      {/* 🚨 Removed Duplicate Navbar and Extra Wrapper */}
      <TransitionGroup>
        <CSSTransition key={location.key} timeout={500} classNames="page">
          <div className="page-wrapper">
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/breakfast" element={<MealResults mealType="breakfast" />} />
              <Route path="/lunch" element={<MealResults mealType="lunch" />} />
              <Route path="/dinner" element={<MealResults mealType="dinner" />} />
              <Route path="/results" element={<SearchResults />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>
        </CSSTransition>
      </TransitionGroup>
      <Chatbot /> {/* Chatbot button added here */}
    </div>
  );
};

export default App;
