const express = require('express');
const app = express();
const { mostafa } = require('./db');

// Parse incoming request body as JSON
app.use(express.json());

// Route that takes 'username' and 'userId' as input and calls the renamed function
app.post('/run-queries', async (req, res) => {
  const { username, userId, userRole } = req.body;

  try {
    await mostafa(username, userId, userRole); // Call the renamed function
    res.json({ message: 'Queries executed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error occurred while executing queries' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
