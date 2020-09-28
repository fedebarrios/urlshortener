const express = require('express');
const router = express.Router();

const Url = require('../model/Url');

// @route   GET /:code
// @desc    Redirect to original url
router.get('/:code', async (req, res) => {
    try {
        let url = await Url.findOne({ urlCode: req.params.code }).select('urlLong -_id');

        

        if (url) {
            return res.redirect(url.urlLong);
        } else {
            return res.status(404).json('No url found'); 
        }
    } catch (e) {
        console.error(e);
        res.status(500).json('Internal server error');
    }
});

module.exports = router;