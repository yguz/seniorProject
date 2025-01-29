import React, { useState } from 'react';
import './recipe.css';

const recipes = [
  {
    name: "Turkey Sandwich",
    price: 7.99,
    image: "https://assets.onecompiler.app/43757a92k/437575bgx/Turkey-Sandwich-4.jpg",
    ingredients: [
      "2 slices (1/2 inch thick) hearty country bread",
      "4 slices roasted turkey breast",
      "1 slice pepperjack cheese",
      "2 teaspoons butter",
      "4 teaspoons strawberry preserves"
    ],
    recipe: [
      "Heat skillet over medium heat.",
      "Butter one side of each bread slice.",
      "Place one slice in skillet.",
      "Top with turkey and cheese.",
      "Place second slice on top, butter side up.",
      "Cook until golden brown, 3-5 minutes."
    ]
  },
  {
    name: "Simple Egg Salad",
    price: 6.99,
    image: "https://assets.onecompiler.app/43757a92k/437575bgx/Egg-Salad-5.jpg",
    ingredients: [
      "6 hard-cooked eggs, chopped",
      "¼ cup chopped cucumber",
      "3 tablespoons ranch dressing",
      "1 tablespoon mustard",
      "salt and ground black pepper to taste"
    ],
    recipe: [
      "Combine all ingredients in a bowl",
      "Mix thoroughly until well combined",
      "Chill for 30 minutes before serving"
    ]
  },
  {
    name: "Caprese Salad",
    price: 8.99,
    image: "https://assets.onecompiler.app/43757a92k/437575bgx/Best-Caprese-Salda-Recipe.jpg",
    ingredients: [
      "4 large ripe tomatoes, sliced",
      "1 fresh mozzarella cheese, sliced",
      "Fresh basil leaves",
      "2 tablespoons extra virgin olive oil",
      "1 tablespoon balsamic vinegar",
      "Salt and pepper to taste"
    ],
    recipe: [
      "Arrange tomato and mozzarella slices on a plate",
      "Tuck fresh basil leaves between slices",
      "Drizzle with olive oil and balsamic vinegar",
      "Season with salt and pepper",
      "Serve immediately"
    ]
  },
  {
    name: "Chicken Caesar Wrap",
    price: 9.49,
    image: "https://assets.onecompiler.app/43757a92k/437575bgx/Blog-Chicken-Caesar-Salad-3-scaled.webp",
    ingredients: [
      "1 large flour tortilla",
      "1 cup cooked chicken, shredded",
      "1 cup romaine lettuce, chopped",
      "¼ cup grated Parmesan cheese",
      "2 tablespoons Caesar dressing",
      "¼ cup croutons"
    ],
    recipe: [
      "Lay tortilla flat and spread dressing",
      "Layer chicken, lettuce, Parmesan and croutons",
      "Fold sides inward and roll tightly",
      "Slice in half and serve"
    ]
  },
  {
    name: "Vegetable Stir-Fry",
    price: 7.99,
    image: "https://assets.onecompiler.app/43757a92k/437575bgx/Stir-Fry-Veggies-17-1024x1024.jpg",
    ingredients: [
      "2 cups broccoli florets",
      "1 red bell pepper, sliced",
      "1 yellow bell pepper, sliced",
      "1 cup snap peas",
      "1 carrot, thinly sliced",
      "2 tablespoons soy sauce",
      "1 tablespoon sesame oil",
      "1 clove garlic, minced"
    ],
    recipe: [
      "Heat oil in skillet/wok",
      "Sauté garlic for 30 seconds",
      "Add vegetables and stir-fry 5-7 minutes",
      "Add soy sauce and toss",
      "Serve with rice/noodles"
    ]
  },
  {
    name: "Beef Tacos",
    price: 8.99,
    image: "https://assets.onecompiler.app/43757a92k/437575bgx/Ground-Beef-Tacos-11-crop-scaled.jpg",
    ingredients: [
      "1 lb ground beef",
      "1 packet taco seasoning",
      "8 small taco shells",
      "1 cup shredded lettuce",
      "1 cup diced tomatoes",
      "½ cup shredded cheddar cheese",
      "¼ cup sour cream"
    ],
    recipe: [
      "Brown ground beef in skillet",
      "Add taco seasoning and simmer",
      "Warm taco shells",
      "Assemble with toppings",
      "Serve immediately"
    ]
  },
  {
    name: "Pasta Primavera",
    price: 10.99,
    image: "https://assets.onecompiler.app/43757a92k/437575bgx/vegan-pasta-primavera-23-sq.webp",
    ingredients: [
      "8 oz pasta (penne or fusilli)",
      "1 cup broccoli florets",
      "1 cup sliced zucchini",
      "1 cup cherry tomatoes, halved",
      "½ cup grated Parmesan cheese",
      "2 tablespoons olive oil",
      "2 cloves garlic, minced",
      "Salt and pepper to taste"
    ],
    recipe: [
      "Cook pasta and drain",
      "Sauté garlic in olive oil",
      "Add vegetables and cook",
      "Toss with pasta",
      "Sprinkle with cheese"
    ]
  },
  {
    name: "Greek Salad",
    price: 7.49,
    image: "https://assets.onecompiler.app/43757a92k/437575bgx/739C7136-CBA2-4DDC-8D56-ECA409F69AB9-3.jpeg",
    ingredients: [
      "2 cups chopped romaine lettuce",
      "1 cup cherry tomatoes, halved",
      "1 cucumber, sliced",
      "½ red onion, thinly sliced",
      "½ cup Kalamata olives",
      "½ cup feta cheese, crumbled",
      "2 tablespoons olive oil",
      "1 tablespoon red wine vinegar",
      "1 teaspoon dried oregano"
    ],
    recipe: [
      "Combine vegetables in bowl",
      "Add feta and olives",
      "Drizzle with oil and vinegar",
      "Sprinkle oregano",
      "Toss gently and serve"
    ]
  }
];

// RecipeBox component remains the same as previous implementation
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

// App component remains the same
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
      <h1>Lunch</h1>
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
