const express = require('express');
const config = require("./config.json");
const path = require('path');
const bp = require('body-parser');

const logger = require('./middleware/logger');

const app = express();

app.use(logger);

const port = process.env.port || config.port;
console.log("Using Port:" + port);

app.use(express.static(path.join(__dirname, 'public')));

// Using the InfZero.js API to run for everything
app.use('/', require('./routes/api/infzero.js'));

// Using the InfZero.js API to run for everything
app.use('/', require('./routes/api/infzero.js'));

app.listen(port, () => console.log(`Server started on port ${port}`));
