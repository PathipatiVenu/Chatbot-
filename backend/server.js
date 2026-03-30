const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();
const pool = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

const verifyToken = require('./middleware/authMiddleware');

// Public Routes
app.use('/api/auth', authRoutes);


app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ message: "DB Connection Active", time: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use('/api/auth', authRoutes);

// Protected Routes (User MUST be logged in)
app.get('/api/user/profile', verifyToken, (req, res) => {
    res.json({ message: "Welcome to your private profile!", userId: req.user.id });
});

// Your Chatbot logic will eventually go here
// app.post('/api/chat', verifyToken, chatController.handleChat);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Example test route to check DB
