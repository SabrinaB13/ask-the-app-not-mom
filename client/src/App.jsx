import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('groceries');

  const [groceryItems, setGroceryItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [newCategory, setNewCategory] = useState('Produce');

  const [recipes, setRecipes] = useState([
    {
      id: 1,
      name: 'Chicken Rice Bowls',
      mealType: 'Dinner',
      ingredients: ['Chicken', 'Rice', 'Broccoli', 'Teriyaki sauce'],
      instructions: 'Cook chicken, rice, and broccoli. Add sauce and portion into containers.',
      photo: '',
    },
    {
      id: 2,
      name: 'Breakfast Burritos',
      mealType: 'Breakfast',
      ingredients: ['Eggs', 'Cheese', 'Sausage', 'Tortillas'],
      instructions: 'Scramble eggs, cook sausage, add cheese, wrap in tortillas, and freeze.',
      photo: '',
    },
  ]);

  const [newRecipeName, setNewRecipeName] = useState('');
  const [newMealType, setNewMealType] = useState('Dinner');
  const [newRecipeIngredients, setNewRecipeIngredients] = useState('');
  const [newRecipeInstructions, setNewRecipeInstructions] = useState('');
  const [recipePhoto, setRecipePhoto] = useState(null);
  const [recipePhotoPreview, setRecipePhotoPreview] = useState('');

  const categories = [
    'Produce',
    'Dairy',
    'Meat',
    'Pantry',
    'Frozen',
    'Snacks',
    'Household',
    'Baby/Kids',
    'Other',
  ];

  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Meal Prep'];

  useEffect(() => {
    fetch('http://localhost:5000/api/groceries')
      .then((response) => response.json())
      .then((data) => setGroceryItems(data))
      .catch((error) => console.error('Error fetching groceries:', error));
  }, []);

  const addItem = () => {
    if (newItem.trim() === '') {
      return;
    }

    fetch('http://localhost:5000/api/groceries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newItem, category: newCategory }),
    })
      .then((response) => response.json())
      .then((createdItem) => {
        setGroceryItems([...groceryItems, createdItem]);
        setNewItem('');
        setNewCategory('Produce');
      })
      .catch((error) => console.error('Error adding grocery item:', error));
  };

  const toggleItem = (id) => {
    setGroceryItems(
      groceryItems.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const deleteItem = (id) => {
    setGroceryItems(groceryItems.filter((item) => item.id !== id));
  };

  const handleRecipePhotoChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    setRecipePhoto(file);
    setRecipePhotoPreview(URL.createObjectURL(file));
  };

  const autofillRecipeFromPhoto = () => {
  if (!recipePhoto) {
    return;
  }

  const formData = new FormData();
  formData.append('recipePhoto', recipePhoto);

  fetch('http://localhost:5000/api/recipes/autofill', {
    method: 'POST',
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      setNewRecipeName(data.recipeName || '');
      setNewMealType(data.mealType || 'Dinner');
      setNewRecipeIngredients((data.ingredients || []).join('\n'));
      setNewRecipeInstructions(data.instructions || '');
    })
    .catch((error) => console.error('Error autofilling recipe:', error));
};

  const addRecipe = () => {
    if (newRecipeName.trim() === '') {
      return;
    }

    const ingredientsArray = newRecipeIngredients
      .split('\n')
      .map((ingredient) => ingredient.trim())
      .filter((ingredient) => ingredient !== '');

    const recipe = {
      id: Date.now(),
      name: newRecipeName.trim(),
      mealType: newMealType,
      ingredients: ingredientsArray,
      instructions: newRecipeInstructions.trim(),
      photo: recipePhotoPreview,
    };

    setRecipes([...recipes, recipe]);
    setNewRecipeName('');
    setNewMealType('Dinner');
    setNewRecipeIngredients('');
    setNewRecipeInstructions('');
    setRecipePhoto(null);
    setRecipePhotoPreview('');
  };

  const deleteRecipe = (id) => {
    setRecipes(recipes.filter((recipe) => recipe.id !== id));
  };

  return (
    <div className="app-container">
      <div className="hero-card">
        <h1>Ask the App, Not Mom</h1>

        <p className="tagline">
          A family meal planning and grocery list app designed to make dinner decisions easier.
        </p>

        <div className="nav-buttons">
          <button
            className={currentScreen === 'groceries' ? 'active-tab' : ''}
            onClick={() => setCurrentScreen('groceries')}
          >
            Grocery List
          </button>

          <button
            className={currentScreen === 'recipes' ? 'active-tab' : ''}
            onClick={() => setCurrentScreen('recipes')}
          >
            Meal Prep Recipes
          </button>
        </div>

        {currentScreen === 'groceries' && (
          <>
            <div className="section">
              <h2>Tonight’s Question</h2>
              <p>What’s for dinner?</p>
              <button>Plan a Meal</button>
            </div>

            <div className="section">
              <h2>Grocery List</h2>

              <div className="grocery-form">
                <input
                  type="text"
                  placeholder="Add a grocery item..."
                  value={newItem}
                  onChange={(event) => setNewItem(event.target.value)}
                />

                <select
                  value={newCategory}
                  onChange={(event) => setNewCategory(event.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <button onClick={addItem}>Add Item</button>
              </div>

              <ul className="grocery-list">
                {groceryItems.map((item) => (
                  <li key={item.id} className={item.completed ? 'completed' : ''}>
                    <label>
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleItem(item.id)}
                      />

                      <span>
                        {item.name}
                        <small className="category-label">
                          {item.category || 'Other'}
                        </small>
                      </span>
                    </label>

                    <button className="delete-button" onClick={() => deleteItem(item.id)}>
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {currentScreen === 'recipes' && (
          <div className="section">
            <h2>Meal Prep Recipes</h2>

            <div className="recipe-form">
              <input
                type="text"
                placeholder="Recipe name..."
                value={newRecipeName}
                onChange={(event) => setNewRecipeName(event.target.value)}
              />

              <label className="photo-upload-label">
                Upload Recipe Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleRecipePhotoChange}
                />
              </label>

              {recipePhotoPreview && (
                <img
                  src={recipePhotoPreview}
                  alt="Recipe preview"
                  className="recipe-photo-preview"
                />
              )}

              {recipePhoto && (
                <button onClick={autofillRecipeFromPhoto}>
                  Autofill Recipe with AI
                </button>
              )}

              <select
                value={newMealType}
                onChange={(event) => setNewMealType(event.target.value)}
              >
                {mealTypes.map((mealType) => (
                  <option key={mealType} value={mealType}>
                    {mealType}
                  </option>
                ))}
              </select>

              <textarea
                placeholder="Add ingredients, one per line..."
                value={newRecipeIngredients}
                onChange={(event) => setNewRecipeIngredients(event.target.value)}
              />

              <textarea
                placeholder="Add recipe instructions..."
                value={newRecipeInstructions}
                onChange={(event) => setNewRecipeInstructions(event.target.value)}
              />

              <button onClick={addRecipe}>Add Recipe</button>
            </div>

            <div className="recipe-list">
              {recipes.map((recipe) => (
                <div className="recipe-card" key={recipe.id}>
                  <div>
                    <h3>{recipe.name}</h3>
                    <p className="meal-type">{recipe.mealType}</p>

                    {recipe.photo && (
                      <img
                        src={recipe.photo}
                        alt={recipe.name}
                        className="recipe-card-photo"
                      />
                    )}

                    <div className="ingredients-list">
                      <strong>Ingredients:</strong>
                      <ul>
                        {recipe.ingredients.map((ingredient, index) => (
                          <li key={index}>{ingredient}</li>
                        ))}
                      </ul>
                    </div>

                    <p>
                      <strong>Instructions:</strong> {recipe.instructions}
                    </p>
                  </div>

                  <button
                    className="delete-button"
                    onClick={() => deleteRecipe(recipe.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;