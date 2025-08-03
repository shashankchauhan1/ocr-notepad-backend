const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'secretKey'; // same as authRoutes.js

// Middleware to verify JWT from cookie
const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Create a note
router.post('/create', authenticate, async (req, res) => {
  const { title, content } = req.body;

  try {
    const newNote = new Note({
      title,
      content,
      userId: req.userId,
    });

    await newNote.save();
    res.status(201).json({ message: 'Note saved successfully' });
  } catch (err) {
    console.error('Note creation error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// GET /api/notes view notes
// GET /api/notes/
router.get('/', async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const notes = await Note.find({ userId }).sort({ createdAt: -1 });
    res.json({ notes });
  } catch (err) {
    console.error('Error fetching notes:', err);
    res.status(500).json({ message: 'Error retrieving notes' });
  }
});


// DELETE /api/notes/:id
router.delete('/:id', authenticate, async (req, res) => {
  const noteId = req.params.id;
  const userId = req.userId;

  try {
    const note = await Note.findOneAndDelete({ _id: noteId, userId });
    if (!note) {
      return res.status(404).json({ message: 'Note not found or unauthorized' });
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    console.error('Error deleting note:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;
