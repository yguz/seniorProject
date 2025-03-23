import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Navbar from './Navbar'; // Import Navbar component
import About from './About';
import Home from './Home';
import Dashboard from './Dashboard';
import Contact from './Contact';
import Login from './Login';
import Register from './Register';
import SearchResults from './SearchResults';
import MealResults from './MealResults';
import RecipeDetails from './RecipeDetails';
import ProtectedRoute from './context/ProtectedRoute';
import './App.css'; // Ensure you have a CSS file for transitions

const App = () => {
  const location = useLocation(); // Get the current route location

  return (
    <div>
      <Navbar /> {/* Include the Navbar at the top */}
      <TransitionGroup>
        <CSSTransition
          key={location.key}
          timeout={500} // The transition duration
          classNames="page" // Transition class names
        >
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
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/recipe/:id" element={<RecipeDetails />} />
            </Routes>
          </div>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
};

export default App;
