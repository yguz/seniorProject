const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
const userRoutes = require('./routes/users');
const recipeRoutes = require('./routes/recipes');
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);

// Serve the frontend
app.use(express.static(path.join(__dirname, '../seniorProject/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../seniorProject/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
