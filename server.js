const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
).then(() => console.log('MongoDB Atlas connected'))
 .catch((err) => console.error('Connection error:', err));


// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'https://nottepreziosa1.netlify.app', // your frontend URL
  credentials: true, // important for cookies
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
// app.use('/api/notes', notesRoutes);

app.get("/home", (req, res) => {
  res.json({ message: "Welcome to NottePreziosa!" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
