const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Backend is running...');
});

// Routes
app.use('/api/contacts', require('./routes/contactRoutes'));

// Port
const PORT = process.env.PORT || 5000;

// MongoDB connection + server start
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch(err => console.log(err));