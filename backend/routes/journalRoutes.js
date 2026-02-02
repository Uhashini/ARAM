const express = require('express');
const router = express.Router();
const Journal = require('../models/Journal');
const jwt = require('jsonwebtoken');

const { authenticate } = require('../middleware/auth');

// @desc    Get user journals
// @route   GET /api/journal
// @access  Private
router.get('/', authenticate, async (req, res) => {
    try {
        const journals = await Journal.find({ user: req.user.userId }).sort({ createdAt: -1 });
        res.status(200).json(journals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create journal entry
// @route   POST /api/journal
// @access  Private
router.post('/', authenticate, async (req, res) => {
    try {
        const { mood, content, date } = req.body;

        if (!mood || !content) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        const journal = await Journal.create({
            user: req.user.userId,
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
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const journal = await Journal.findById(req.params.id);

        if (!journal) {
            return res.status(404).json({ message: 'Journal not found' });
        }

        // Make sure the logged in user matches the journal user
        if (journal.user.toString() !== req.user.userId.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await journal.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
