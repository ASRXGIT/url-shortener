// Load environment variables from .env file
require("dotenv").config();

const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');
const app = express();

// Route file
const indexRouter = require('./routes/index');

// PORT
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/', indexRouter);

app.get('/test', (req, res) => {
    res.send('test route');
});

// Connect to MongoDB
const dbURL = process.env.DATABASE_URL;
if (!dbURL) {
    console.error("DATABASE_URL is undefined. Check your .env file.");
    process.exit(1); // Stop the server if DB URL is not found
}

mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Database connection successful'))
.catch((err) => console.error('Error in DB connection:', err));

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
