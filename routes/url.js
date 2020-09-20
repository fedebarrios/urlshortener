const express = require('express');
const router = express.Router();
const validUrl = require('valid-url');
const shortId = require('shortid');
const config = require('config');

const Url = require('../model/Url');

// @route   POST /api/url/shortener
// @desc    Create short url
router.post('/shortener', async (req, res) => {
    const { urlLong } = req.body;
    const baseUrl = config.get('baseUrl');

    // check base url
    if (!validUrl.isUri(baseUrl)) {
        return res.status(401).json('Invalid base url');
    }

    // create url short id code
    const urlCode = shortId.generate();

    // create short url
    if (validUrl.isUri(urlLong)) {
        try {
           let url = await Url.findOne({ urlLong });
           
           if (url) {
            res.json(url);
           } else {
            const meliUrl = config.get('meliUrl');
            const urlShort = meliUrl + '/' + urlCode;

            url = new Url({
                urlLong,
                urlShort,
                urlCode,
                date: new Date()
            });

            await url.save();
            res.json(url);
           }

        } catch (e) {
            console.error(e);
            res.status(500).json('Internal server error');
        }
    } else {
        res.status(401).json('Invalid long url');
    }
});

// @route   POST /api/url/longener
// @desc    Get long url
router.post('/longener', async (req, res) => {
    const { urlShort } = req.body;
    const baseUrl = config.get('baseUrl');

    // check base url
    if (!validUrl.isUri(baseUrl)) {
        return res.status(401).json('Invalid base url');
    }

    if (urlShort) {
        try {

            let urlLong = await Url.findOne({ urlShort }).select('urlLong -_id');
            res.json(urlLong);

        } catch (e) {
            console.error(e);
            res.status(500).json('Internal server error');
        }
    } else {
        res.status(404).json('No short url found');
    }
});

// @route   POST /api/url/deleteShortUrl
// @desc    Delete short url
router.post('/deleteShortUrl', async (req, res) => {
    const { urlShort } = req.body;
    const baseUrl = config.get('baseUrl');

    // check base url
    if (!validUrl.isUri(baseUrl)) {
        return res.status(401).json('Invalid base url');
    }

    if (urlShort) {
        try {

            // TODO: mejorar esta respuesta en formato json con un ok
            let urlLong = await Url.findOneAndDelete({ urlShort });
            res.json(urlLong);

        } catch (e) {
            console.error(e);
            res.status(500).json('Internal server error');
        }
    } else {
        res.status(404).json('No short url found');
    }
});

module.exports = router;