const express = require('express');
const app = express();
const { findUser } = require('./db');

// Parse incoming request body as JSON
app.use(express.json());

// Route that takes 'username' and 'userId' as input and passes them to the vulnerable function
app.post('/find-user', async (req, res) => {
  const { username, userId, userRole } = req.body;

  try {
    const user = await findUser(username, userId, userRole); // Calling vulnerable function
    if (user.length > 0) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error occurred' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
