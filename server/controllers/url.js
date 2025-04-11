const Url = require('../models/Url');
const validateUrl = require('../utils/validateUrl');
const generateUniqueId = require('../utils/generateUniqueId');

async function createShortUrl(req, res) {
    const { url } = req.body;
    const clientUrl = `${req.protocol}://${req.get("host")}`; // Dynamic BASE_URL

    if (!validateUrl(url)) {
        return res.status(400).json({ message: 'Invalid URL' });
    }

    try {
        const existing = await Url.findOne({ url });
        if (existing) {
            const shortUrl = `${clientUrl}/${existing.shortUrlId}`;
            return res.status(200).json({ shortUrl, clicks: existing.clicks });
        }

        const shortUrlId = await generateUniqueId();

        const newEntry = new Url({
            url,
            shortUrlId,
            date: new Date()
        });

        await newEntry.save();

        const shortUrl = `${clientUrl}/${shortUrlId}`;
        res.status(200).json({ shortUrl, clicks: 0 });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}

async function redirectToOriginalUrl(req, res) {
    const { shortUrlId } = req.params;

    try {
        const urlDoc = await Url.findOne({ shortUrlId });
        if (!urlDoc) {
            return res.status(404).json({ message: 'No URL found' });
        }

        await Url.findByIdAndUpdate(urlDoc._id, { $inc: { clicks: 1 } });
        return res.redirect(urlDoc.url);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}

async function deleteUrl(req, res) {
    const { url } = req.body;

    try {
        const result = await Url.deleteOne({ url });
        if (result.deletedCount === 0) {
            return res.status(400).json({ message: 'No such URL found' });
        }
        res.status(200).json({ message: `URL ${url} deleted` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}

module.exports = {
    createShortUrl,
    redirectToOriginalUrl,
    deleteUrl
};
