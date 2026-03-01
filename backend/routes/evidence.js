const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Evidence = require('../models/Evidence');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Ensure evidence upload directory exists
const uploadDir = path.join(__dirname, '..', 'uploads', 'evidence');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Auth Middleware (simple inline version for speed)
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Support both id and userId in payload for compatibility
            const userId = decoded.id || decoded.userId;
            req.user = { userId };

            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

/**
 * @route   POST /api/evidence
 * @desc    Upload new evidence
 */
router.post('/', protect, upload.single('file'), async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }

        const evidence = new Evidence({
            userId: req.user.userId,
            title: title || req.file.originalname,
            description: description || '',
            fileName: req.file.filename,
            fileType: req.file.mimetype
        });

        const savedEvidence = await evidence.save();
        res.status(201).json(savedEvidence);

    } catch (error) {
        console.error('Evidence upload error:', error);
        res.status(500).json({ message: 'Server error during upload' });
    }
});

/**
 * @route   GET /api/evidence
 * @desc    Get user's evidence list
 */
router.get('/', protect, async (req, res) => {
    try {
        const items = await Evidence.find({ userId: req.user.userId }).sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching evidence' });
    }
});

/**
 * @route   GET /api/evidence/check-pin
 * @desc    Check if user has set a locker pin
 */
router.get('/check-pin', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        res.json({ hasPin: !!user.evidenceLockerPin });
    } catch (error) {
        res.status(500).json({ message: 'Server error check pin' });
    }
});

/**
 * @route   POST /api/evidence/verify-pin
 * @desc    Verify locker pin
 */
router.post('/verify-pin', protect, async (req, res) => {
    try {
        const { pin } = req.body;
        const user = await User.findById(req.user.userId);

        if (!user.evidenceLockerPin) {
            return res.status(400).json({ message: 'No pin set' });
        }

        const isMatch = await user.matchLockerPin(pin);
        if (isMatch) {
            res.json({ success: true });
        } else {
            res.status(401).json({ success: false, message: 'Invalid pin' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error verifying pin' });
    }
});

/**
 * @route   POST /api/evidence/set-pin
 * @desc    Set or update locker pin
 */
router.post('/set-pin', protect, async (req, res) => {
    try {
        const { pin } = req.body;
        const user = await User.findById(req.user.userId);

        user.evidenceLockerPin = pin;
        await user.save();

        res.json({ success: true, message: 'Pin set successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error setting pin' });
    }
});

module.exports = router;
