const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Ask the App, Not Mom backend is running!');
});

app.get('/api/groceries', (req, res) => {
  res.json([
    { id: 1, name: 'Milk', completed: false },
    { id: 2, name: 'Chicken', completed: false },
    { id: 3, name: 'Rice', completed: false },
  ]);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});