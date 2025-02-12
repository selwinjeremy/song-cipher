const express = require('express');
const cors = require('cors');

const app = express();
const port = 5000;

// Enable CORS for cross-origin requests
app.use(cors());

// A basic route to return "Hello, World!"
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});