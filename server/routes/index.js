const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

const express = require('express');
const router = express.Router();

const {
    createShortUrl,
    redirectToOriginalUrl,
    deleteUrl
} = require('../controllers/url');

const Url = require('../models/Url');

// Test route
router.get('/', (req, res) => {
    res.json({ message: 'API working successfully' });
});

// Create short URL
router.post('/', createShortUrl);

// Redirect to original
router.get('/:shortUrlId', redirectToOriginalUrl);

// Delete short URL
router.delete('/', deleteUrl);

// Analytics route
router.get('/analytics/:shortId', async (req, res) => {
    const { shortId } = req.params;

    try {
        const urlEntry = await Url.findOne({ shortUrlId: shortId });

        if (!urlEntry) {
            return res.status(404).json({ message: 'Short URL not found' });
        }

        res.json({
            shortId: urlEntry.shortUrlId,
            originalUrl: urlEntry.url,
            clickCount: urlEntry.clicks
        });
    } catch (err) {
        console.error('Analytics error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
