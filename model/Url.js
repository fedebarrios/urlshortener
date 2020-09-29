const mongoose = require('mongoose');

const table = new mongoose.Schema({
    urlCode: {type: String},
    urlLong: {type: String},
    urlShort: {type: String},
    date: {type: String, default: Date.now},
    clicks: {type: Number}
});

module.exports = mongoose.model('Url', table);