const express = require('express');
const router = express.Router();
const config = require('config');

const Url = require('../model/Url');

// @route   GET /:code
// @desc    Redirect to original url
router.get('/:code', async (req, res) => {
    try {
        //const urlCode = req.params.code; 
        //console.log(urlCode);

        // get urlLong from code
        let url = await Url.findOne({ urlCode: req.params.code });

        //const baseUrl = config.get('baseUrl');

        if (url) {
            // increment clicks if redirect
            let clicks = url.clicks;
            clicks++;

            // first redirect just to dont make the user wait for update
            res.redirect(url.urlLong);

            // then update 
            return url.updateOne({ clicks });

            //return res.redirect(baseUrl + '/' + req.params.code);

        } else {
            return res.status(404).json('No url found'); 
        }
    } catch (e) {
        console.error(e);
        res.status(500).json('Internal server error');
    }
});

module.exports = router;