const express = require('express');
const router = express.Router();
const config = require('config');

const Url = require('../model/Url');

// @route   GET /:code
// @desc    Redirect to original url
router.get('/:code', async (req, res) => {
    try {

        // get urlLong from code
        let url = await Url.findOne({ urlCode: req.params.code });

        if (url) {
            // increment clicks if redirect
            let clicks = url.clicks;
            clicks++;

            // first redirect to dont make the user wait for update
            res.redirect(url.urlLong);

            // then update
            return url.updateOne({ clicks });

        } else {
            return res.status(404).json('No url found'); 
        }
    } catch (e) {
        console.error(e);
        res.status(500).json('Internal server error');
    }
});

module.exports = router;