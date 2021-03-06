const express = require('express');
const connectDB = require('./config/db');

const app = express();

// database connections
connectDB();

app.use(express.json({ extended: false }))

// define routes
app.use('/', require('./routes/index'));
app.use('/api/url', require('./routes/url'));

const port = process.env.PORT;
app.listen(port, () => console.log('Server listen to port ' + port));