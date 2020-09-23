const mongoose = require('mongoose');
const db = process.env.mongoURI;

const connectDB = async () => {
    try {
        mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        console.log('MongoDB Connected...');
    } catch (e) {
        console.error(err.message);
        process.exit(1);
    }
}

module.exports = connectDB;

