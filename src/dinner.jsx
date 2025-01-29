import React, { useState } from 'react';
import './styles.css';

const recipes = [
  {
    name: "Grilled Salmon",
    price: 12.99,
    image: "https://assets.onecompiler.app/43757a92k/437575bgx/grilled%20salmon%202.jpg",
    ingredients: [
      "2 salmon fillets",
      "2 tablespoons olive oil",
      "1 teaspoon garlic powder",
      "1 teaspoon paprika",
      "Salt and pepper to taste",
      "1 lemon, sliced"
    ],
    recipe: [
      "Preheat grill to medium-high heat.",
      "Brush salmon with olive oil and season with garlic powder, paprika, salt, and pepper.",
      "Place salmon on the grill and cook for 4-5 minutes per side.",
      "Serve with lemon slices."
    ]
  },
  {
    name: "Beef Stew",
    price: 11.99,
    image: "https://assets.onecompiler.app/43757a92k/437575bgx/beef%20stew.jpg",
    ingredients: [
      "1 lb beef stew meat",
      "2 cups beef broth",
      "1 cup carrots, sliced",
      "1 cup potatoes, diced",
      "1 onion, chopped",
      "2 tablespoons flour",
      "2 tablespoons olive oil",
      "Salt and pepper to taste"
    ],
    recipe: [
      "Heat olive oil in a large pot and brown the beef.",
      "Add onions and cook until softened.",
      "Sprinkle flour over the beef and stir to coat.",
      "Add beef broth, carrots, and potatoes. Bring to a boil, then simmer for 1.5 hours.",
      "Season with salt and pepper before serving."
    ]
  },
  {
    name: "Chicken Alfredo",
    price: 10.99,
    image: "https://assets.onecompiler.app/43757a92k/437575bgx/chicken%20alfredo.webp",
    ingredients: [
      "8 oz fettuccine pasta",
      "2 chicken breasts, sliced",
      "1 cup heavy cream",
      "1/2 cup grated Parmesan cheese",
      "2 tablespoons butter",
      "2 cloves garlic, minced",
      "Salt and pepper to taste"
    ],
    recipe: [
      "Cook pasta according to package instructions.",
      "In a skillet, cook chicken in butter until browned. Add garlic and cook for 1 minute.",
      "Pour in heavy cream and Parmesan cheese. Stir until thickened.",
      "Toss pasta in the sauce and serve."
    ]
  },
  {
    name: "Vegetable Lasagna",
    price: 9.99,
    image: "https://assets.onecompiler.app/43757a92k/437575bgx/Vegetable%20Lasagna.webp",
    ingredients: [
      "9 lasagna noodles",
      "2 cups marinara sauce",
      "1 cup ricotta cheese",
      "1 cup spinach, chopped",
      "1 cup zucchini, sliced",
      "1 cup mozzarella cheese, shredded",
      "1/4 cup Parmesan cheese"
    ],
    recipe: [
      "Preheat oven to 375°F (190°C).",
      "Layer noodles, marinara sauce, ricotta, spinach, zucchini, and cheeses in a baking dish.",
      "Repeat layers and top with mozzarella and Parmesan.",
      "Bake for 30 minutes or until bubbly."
    ]
  },
  {
    name: "Shrimp Scampi",
    price: 13.99,
    image: "https://assets.onecompiler.app/43757a92k/437575bgx/shrimp%20scampi.webp",
    ingredients: [
      "1 lb shrimp, peeled and deveined",
      "8 oz linguine pasta",
      "4 tablespoons butter",
      "4 cloves garlic, minced",
      "1/2 cup white wine",
      "1/4 cup parsley, chopped",
      "Salt and pepper to taste"
    ],
    recipe: [
      "Cook pasta according to package instructions.",
      "In a skillet, melt butter and sauté garlic until fragrant.",
      "Add shrimp and cook until pink. Pour in white wine and simmer for 2 minutes.",
      "Toss pasta in the sauce, garnish with parsley, and serve."
    ]
  },
  {
    name: "Stuffed Peppers",
    price: 8.99,
    image: "https://assets.onecompiler.app/43757a92k/437575bgx/stuffed%20peppers.webp",
    ingredients: [
      "4 bell peppers, tops cut off and seeds removed",
      "1 lb ground beef",
      "1 cup cooked rice",
      "1 cup marinara sauce",
      "1/2 cup shredded cheese",
      "1 onion, chopped",
      "Salt and pepper to taste"
    ],
    recipe: [
      "Preheat oven to 375°F (190°C).",
      "Cook ground beef and onions in a skillet. Mix with rice and marinara sauce.",
      "Stuff peppers with the mixture and top with cheese.",
      "Bake for 25-30 minutes."
    ]
  },
  {
    name: "Roast Chicken",
    price: 14.99,
    image: "https://assets.onecompiler.app/43757a92k/437575bgx/Roasted%20Chicken.jpg",
    ingredients: [
      "1 whole chicken",
      "2 tablespoons olive oil",
      "1 lemon, halved",
      "4 cloves garlic",
      "1 tablespoon rosemary",
      "Salt and pepper to taste"
    ],
    recipe: [
      "Preheat oven to 425°F (220°C).",
      "Rub chicken with olive oil, salt, pepper, and rosemary.",
      "Stuff cavity with lemon and garlic.",
      "Roast for 1.5 hours or until internal temperature reaches 165°F (74°C)."
    ]
  },
  {
    name: "Lamb Chops",
    price: 16.99,
    image: "https://assets.onecompiler.app/43757a92k/437575bgx/lamb%20chops.webp",
    ingredients: [
      "4 lamb chops",
      "2 tablespoons olive oil",
      "2 cloves garlic, minced",
      "1 tablespoon rosemary",
      "Salt and pepper to taste"
    ],
    recipe: [
      "Season lamb chops with salt, pepper, garlic, and rosemary.",
      "Heat olive oil in a skillet over medium-high heat.",
      "Sear lamb chops for 3-4 minutes per side for medium-rare.",
      "Let rest for 5 minutes before serving."
    ]
  }
];

const RecipeBox = ({ recipe }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState('');

  const handleCommentSubmit = () => {
    // Handle comment submission logic here
    setShowComment(false);
    setComment('');
  };

  return (
    <div className={`recipe-box ${isFlipped ? 'flipped' : ''}`} onClick={() => setIsFlipped(!isFlipped)}>
      <div className="front">
        <img src={recipe.image} alt={recipe.name} />
        <h3>{recipe.name}</h3>
        <p>${recipe.price.toFixed(2)}</p>
      </div>
      <div className="back">
        <h3>{recipe.name}</h3>
        <div className="ingredients">
          <h4>Ingredients:</h4>
          {recipe.ingredients.map((item, index) => (
            <p key={index}>{item}</p>
          ))}
        </div>
        <div className="instructions">
          <h4>Recipe:</h4>
          {recipe.recipe.map((step, index) => (
            <p key={index}>{step}</p>
          ))}
        </div>
        <button 
          className="comment-btn" 
          onClick={(e) => {
            e.stopPropagation();
            setShowComment(!showComment);
          }}
        >
          Add Comment
        </button>
        {showComment && (
          <div className="comment-box" onClick={(e) => e.stopPropagation()}>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Enter your comment here..."
            />
            <button className="submit-comment" onClick={handleCommentSubmit}>
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const App = () => {
  const [sortOrder, setSortOrder] = useState('');
  const [sortedRecipes, setSortedRecipes] = useState(recipes);

  const handleSortChange = (e) => {
    const order = e.target.value;
    setSortOrder(order);
    
    const sorted = [...recipes].sort((a, b) => {
      if (order === 'lowToHigh') return a.price - b.price;
      if (order === 'highToLow') return b.price - a.price;
      return 0;
    });
    
    setSortedRecipes(sorted);
  };

  return (
    <div className="App">
      <h1>Dinner</h1>
      <select value={sortOrder} onChange={handleSortChange}>
        <option value="">Price Filter</option>
        <option value="lowToHigh">Low to High</option>
        <option value="highToLow">High to Low</option>
      </select>

      <div className="container">
        {sortedRecipes.map((recipe, index) => (
          <RecipeBox key={index} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export default App;
