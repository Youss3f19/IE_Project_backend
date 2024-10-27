const express = require('express');
const cors = require('cors');
const userApi = require('./routes/users');
const examApi = require('./routes/exams');
require('./config/connect');

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Set limit for JSON
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Set limit for URL-encoded data

// Use routes
app.use('/user', userApi);
app.use('/exam', examApi);

// Start the server
app.listen(3001, () => {
  console.log('Server is running on port 3001!');
});
