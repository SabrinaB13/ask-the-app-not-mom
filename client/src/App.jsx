import { useState } from 'react';
import './App.css';

function App() {
  const [groceryItems, setGroceryItems] = useState([
    { id: 1, name: 'Milk', completed: false },
    { id: 2, name: 'Chicken', completed: false },
    { id: 3, name: 'Rice', completed: false },
    { id: 4, name: 'Fruit snacks', completed: false },
  ]);

  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    if (newItem.trim() === '') {
      return;
    }

    const item = {
      id: Date.now(),
      name: newItem,
      completed: false,
    };

    setGroceryItems([...groceryItems, item]);
    setNewItem('');
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

  return (
    <div className="app-container">
      <div className="hero-card">
        <h1>Ask the App, Not Mom</h1>

        <p className="tagline">
          A family meal planning and grocery list app designed to make dinner decisions easier.
        </p>

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
                  {item.name}
                </label>

                <button className="delete-button" onClick={() => deleteItem(item.id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;