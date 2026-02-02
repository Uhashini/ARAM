const express = require('express');
const router = express.Router();
const Journal = require('../models/Journal');
const jwt = require('jsonwebtoken');

// Middleware to protect routes
const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token not password
            req.user = { id: decoded.id };

            next();
        } catch (error) {
            console.log(error);
            res.status(401).json({ message: 'Not authorized' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// @desc    Get user journals
// @route   GET /api/journal
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const journals = await Journal.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(journals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create journal entry
// @route   POST /api/journal
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { mood, content, date } = req.body;

        if (!mood || !content) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        const journal = await Journal.create({
            user: req.user.id,
            mood,
            content,
            date: date || new Date().toISOString().split('T')[0]
        });

        res.status(201).json(journal);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete journal entry
// @route   DELETE /api/journal/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const journal = await Journal.findById(req.params.id);

        if (!journal) {
            return res.status(404).json({ message: 'Journal not found' });
        }

        // Check for user
        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Make sure the logged in user matches the journal user
        if (journal.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await journal.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
