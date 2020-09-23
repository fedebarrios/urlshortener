const mongoose = require('mongoose');

const bussinessTable = new mongoose.Schema({
    created: {type: Number},
    deleted: {type: Number}
});

module.exports = mongoose.model('Bussiness', bussinessTable);