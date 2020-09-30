const express = require('express');
const router = express.Router();
const validUrl = require('valid-url');
const shortId = require('shortid');
const config = require('config');

const Url = require('../model/Url');
const Deleted = require('../model/Deleted');
const Created = require('../model/Created');

// @route   POST /api/url/shortener
// @desc    Create short url
router.post('/shortener', async (req, res) => {
    const { urlLong } = req.body;

    // create url short id code
    const urlCode = shortId.generate();

    // is urlLong valid
    if (validUrl.isUri(urlLong)) {
        try {
           let url = await Url.findOne({ urlLong });
           
           if (url) {
            res.json(url);
           } else {
            // create short url
            const meliUrl = config.get('meliUrl');
            const urlShort = meliUrl + '/' + urlCode;

            url = new Url({
                urlLong,
                urlShort,
                urlCode,
                date: new Date(),
                clicks: 0
            });
            await url.save();

            // increment createdUrls count
            let created = new Created({
                createdUrls: 'Ok'
            });
            await created.save();

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

    if (urlShort) {
        try {
            //get only urlLong from urlShort
            let urlLong = await Url.findOne({ urlShort }).select('urlLong -_id');

            if (urlLong) {
                res.json(urlLong);
            } else {
                res.status(404).json('No short url found');
            }

        } catch (e) {
            console.error(e);
            res.status(500).json('Internal server error');
        }
    } else {
        res.status(404).json('No short url given');
    }
});

// @route   POST /api/url/deleteShortUrl
// @desc    Delete short url
router.post('/deleteShortUrl', async (req, res) => {
    const { urlShort } = req.body;

    if (urlShort) {
        try {
            // find by urlShort and delete collection
            let urlLong = await Url.findOneAndDelete({ urlShort });

            if (urlLong) {
                let deleted = new Deleted({
                    deletedUrls: 'Ok'
                });

                await deleted.save();

                res.json('Ok, deleted');
            } else {
                res.status(404).json('No short url found');
            }

        } catch (e) {
            console.error(e);
            res.status(500).json('Internal server error');
        }
    } else {
        res.status(404).json('No short url given');
    }
});

// @route   POST /api/url/getMetrics
// @desc    Get bussiness metrics
router.post('/getMetrics', async (req, res) => {

    try {
        // find all collections
        let deleted = await Deleted.find({ });
        let created = await Created.find({ });

        // count quantity
        let deletedCount = deleted.length;
        let createdCount = created.length;

        let resp = {
            'createdUrls' : createdCount,
            'deletedUrls' : deletedCount
        }

        res.json(resp);

    } catch (e) {
        console.error(e);
        res.status(500).json('Internal server error');
    }

});

module.exports = router;