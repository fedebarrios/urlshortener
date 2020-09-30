const mongoose = require('mongoose');

const createdTable = new mongoose.Schema({
    createdUrls: {type: String}
});

module.exports = mongoose.model('Created', createdTable);