import React, { useState } from 'react';
import './recipe.css';

const recipes = [
  {
    name: "Classic Pancakes",
    price: 5.99,
    image: "https://assets.onecompiler.app/43757a92k/437575bgx/pancake.jpg",
    ingredients: [
      "1 cup all-purpose flour",
      "2 tablespoons sugar",
      "1 tablespoon baking powder",
      "1/2 teaspoon salt",
      "1 cup milk",
      "1 egg",
      "2 tablespoons melted butter"
    ],
    recipe: [
      "Mix dry ingredients in a bowl.",
      "Add milk, egg, and melted butter. Stir until combined.",
      "Heat a skillet over medium heat and lightly grease.",
      "Pour 1/4 cup batter for each pancake.",
      "Cook until bubbles form, then flip and cook until golden brown."
    ]
  },
  {
    name: "Cheese Omelette",
    price: 4.99,
    image: "https://assets.onecompiler.app/43757a92k/437575bgx/cheese%20omelet.jpg",
    ingredients: [
      "3 eggs",
      "1/4 cup shredded cheddar cheese",
      "1 tablespoon butter",
      "Salt and pepper to taste"
    ],
    recipe: [
      "Beat eggs in a bowl and season with salt and pepper.",
      "Heat butter in a skillet over medium heat.",
      "Pour eggs into the skillet and let them set slightly.",
      "Sprinkle cheese on one half of the omelette.",
      "Fold the omelette in half and cook until cheese melts."
    ]
  },
  {
    name: "Avocado Toast",
    price: 6.49,
    image: "https://assets.onecompiler.app/43757a92k/437575bgx/avocado%20toast.jpg",
    ingredients: [
      "1 ripe avocado",
      "2 slices whole-grain bread",
      "1 tablespoon olive oil",
      "Salt and pepper to taste",
      "Optional: red pepper flakes or poached egg"
    ],
    recipe: [
      "Toast the bread slices until golden brown.",
      "Mash the avocado in a bowl and season with salt and pepper.",
      "Spread the mashed avocado evenly on the toast.",
      "Drizzle with olive oil and add optional toppings.",
      "Serve immediately."
    ]
  },
  {
    name: "Berry Smoothie Bowl",
    price: 7.99,
    image: "https://assets.onecompiler.app/43757a92k/437575bgx/berry%20smoothie%20bowl.jpg",
    ingredients: [
      "1 frozen banana",
      "1/2 cup frozen mixed berries",
      "1/2 cup almond milk",
      "Toppings: granola, fresh berries, chia seeds"
    ],
    recipe: [
      "Blend banana, berries, and almond milk until smooth.",
      "Pour into a bowl.",
      "Top with granola, fresh berries, and chia seeds.",
      "Serve immediately."
    ]
  },
  {
    name: "French Toast",
    price: 6.99,
    image: "https://assets.onecompiler.app/43757a92k/437575bgx/french%20toast.jpg",
    ingredients: [
      "4 slices bread",
      "2 eggs",
      "1/2 cup milk",
      "1 teaspoon vanilla extract",
      "1/2 teaspoon cinnamon",
      "Butter for frying"
    ],
    recipe: [
      "Whisk eggs, milk, vanilla, and cinnamon in a bowl.",
      "Dip bread slices into the mixture, coating both sides.",
      "Heat butter in a skillet over medium heat.",
      "Cook bread until golden brown on both sides.",
      "Serve with syrup or fresh fruit."
    ]
  },
  {
    name: "Egg Sandwich",
    price: 6.99,
    image: "https://assets.onecompiler.app/43757a92k/437575bgx/egg%20sandwich.jpg",
    ingredients: [
      "1 English muffin",
      "1 egg",
      "1 slice cheese",
      "1 slice ham",
      "1 tsp butter"
    ],
    recipe: [
      "Toast English muffin",
      "Cook egg sunny-side up",
      "Assemble sandwich with cheese and ham",
      "Grill briefly to melt cheese"
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
      <h1>Breakfast</h1>
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
