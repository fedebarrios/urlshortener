const mongoose = require('mongoose');

const deletedTable = new mongoose.Schema({
    deletedUrls: {type: String}
});

module.exports = mongoose.model('Deleted', deletedTable);