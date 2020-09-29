const mongoose = require('mongoose');

const bussinessTable = new mongoose.Schema({
    createdUrls: {type: Number},
    deletedUrls: {type: Number}
});

module.exports = mongoose.model('Bussiness', bussinessTable);