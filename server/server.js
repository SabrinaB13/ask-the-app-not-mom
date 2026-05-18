require('dotenv').config();

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const OpenAI = require('openai');

const app = express();
const PORT = 5000;

const upload = multer({ storage: multer.memoryStorage() });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json());

let groceryItems = [
  { id: 1, name: 'Milk', category: 'Dairy', completed: false },
  { id: 2, name: 'Chicken', category: 'Meat', completed: false },
  { id: 3, name: 'Rice', category: 'Pantry', completed: false },
];

app.get('/', (req, res) => {
  res.send('Ask the App, Not Mom backend is running!');
});

app.get('/api/groceries', (req, res) => {
  res.json(groceryItems);
});

app.post('/api/groceries', (req, res) => {
  const { name, category } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ message: 'Grocery item name is required.' });
  }

  const newItem = {
  id: Date.now(),
  name: name.trim(),
  category: category || 'Other',
  completed: false,
};

  groceryItems.push(newItem);

  res.status(201).json(newItem);
});

app.post('/api/recipes/autofill', upload.single('recipePhoto'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Recipe photo is required.' });
    }

    const base64Image = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;

    const response = await openai.responses.create({
  model: 'gpt-5.4-mini',
  input: [
    {
      role: 'user',
      content: [
        {
          type: 'input_text',
          text:
            'Read this recipe image and return only valid JSON with these fields: recipeName, mealType, ingredients, instructions. mealType must be one of Breakfast, Lunch, Dinner, Snack, or Meal Prep. ingredients must be an array of strings. instructions must be a single string. If something is missing, make a reasonable best guess.',
        },
        {
          type: 'input_image',
          image_url: `data:${mimeType};base64,${base64Image}`,
        },
      ],
    },
  ],
});
    });

    const aiText = response.output_text;
    const recipeData = JSON.parse(aiText);

    res.json(recipeData);
  } catch (error) {
    console.error('Error autofilling recipe:', error);
    res.status(500).json({ message: 'Failed to autofill recipe from image.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});