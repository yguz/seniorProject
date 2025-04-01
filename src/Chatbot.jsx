import React, { useState, useEffect } from 'react';
import './Chatbot.css';
import { FaRobot, FaUser, FaTimes, FaPaperPlane, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: "Hi! Ask me for a recipe!", sender: "bot" }]);
  const [input, setInput] = useState("");
  const [buttonPosition, setButtonPosition] = useState(20);
  const [recipeData, setRecipeData] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const fetchRecipe = async (query) => {
    try {
      const apiKey = "e062bec98f5d425fbce111b8d5a43bae"; 
      const searchUrl = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=3&addRecipeInformation=true&apiKey=${apiKey}`;
      
      const response = await fetch(searchUrl);
      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        return { error: "❌ No recipes found. Try searching for another dish!" };
      }

      const recipes = await Promise.all(
        data.results.map(async (recipe) => {
          const detailsUrl = `https://api.spoonacular.com/recipes/${recipe.id}/information?includeNutrition=true&apiKey=${apiKey}`;
          const detailsResponse = await fetch(detailsUrl);
          const detailsData = await detailsResponse.json();
          
          return {
            title: detailsData.title,
            calories: detailsData.nutrition?.nutrients?.find(n => n.name === "Calories")?.amount || "N/A",
            ingredients: detailsData.extendedIngredients.map(ing => ing.original),
            instructions: detailsData.analyzedInstructions[0]?.steps.map(step => `Step ${step.number}: ${step.step}`) || ["No instructions available."],
          };
        })
      );
      
      return recipes;
    } catch (error) {
      return { error: "🚨 Oops! Something went wrong while fetching the recipes." };
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");

    const recipes = await fetchRecipe(input);

    if (recipes.error) {
      const botMessage = { text: recipes.error, sender: "bot" };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      return;
    }

    setRecipeData(recipes);
    setCurrentRecipeIndex(0);
    setMessages((prevMessages) => [...prevMessages, { text: "Click the button below to view the recipe details!", sender: "bot", button: true }]);
  };

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const prevRecipe = () => {
    setCurrentRecipeIndex((prevIndex) => (prevIndex === 0 ? recipeData.length - 1 : prevIndex - 1));
  };

  const nextRecipe = () => {
    setCurrentRecipeIndex((prevIndex) => (prevIndex === recipeData.length - 1 ? 0 : prevIndex + 1));
  };

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.querySelector("footer");
      if (!footer) return;

      const footerRect = footer.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      if (footerRect.top < viewportHeight) {
        setButtonPosition(footerRect.height + 20);
      } else {
        setButtonPosition(20);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <button className="chatbot-btn" onClick={toggleChat} style={{ bottom: `${buttonPosition}px` }}>
        <FaRobot />
      </button>

      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <h3>Recipe Chatbot</h3>
            <FaTimes className="chatbot-close-btn" onClick={toggleChat} />
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message-container ${msg.sender}`}>
                {msg.sender === "bot" ? <FaRobot className="chat-icon bot-icon" /> : <FaUser className="chat-icon user-icon" />}
                <div className={`chat-message ${msg.sender}`}>
                  {msg.text}
                  {msg.button && (
                    <button className="view-recipe-btn" onClick={openPopup}>
                      View Recipe 🍽️
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="chatbot-input">
            <input type="text" placeholder="Ask me about recipes..." value={input} onChange={(e) => setInput(e.target.value)} />
            <button onClick={handleSendMessage}><FaPaperPlane /></button>
          </div>
        </div>
      )}

      {isPopupOpen && recipeData.length > 0 && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>{recipeData[currentRecipeIndex].title}</h2>
            <p><strong>Calories:</strong> {recipeData[currentRecipeIndex].calories} kcal</p>
            <h3>🥕 Ingredients:</h3>
            <ul>
              {recipeData[currentRecipeIndex].ingredients.map((ingredient, i) => (
                <li key={i}>{ingredient}</li>
              ))}
            </ul>
            <h3>📝 Instructions:</h3>
            <ol>
              {recipeData[currentRecipeIndex].instructions.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
            <div className="popup-navigation" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <FaArrowLeft className="nav-arrow" onClick={prevRecipe} />
              <span className="slide-indicator">{currentRecipeIndex + 1} of {recipeData.length}</span>
              <FaArrowRight className="nav-arrow" onClick={nextRecipe} />
            </div>
            <button className="popup-close-btn" onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
