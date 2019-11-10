const express = require('express');
const config = require("./config.json");
const path = require('path');
const bp = require('body-parser');

const logger = require('./middleware/logger');//Logger.js middleware to log requests

//Init express
const app = express();

//Initialize middleware
//app.use(logger); //Goes ahead and uses logger.js which grabs the original site and time of access

// BP Body Parser
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());

const port = process.env.port || config.port;
console.log(port);

//Create your endpoints/route handlers
// app.get('/', function(req, res) {
//     //Fetch from database
//     //Load pages
//     //Return JSON
//     //Full access to request and response
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// })

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Members API Routes
app.use('/api/members', require('./routes/api/members'));

//Listen on a port
app.listen(port, () => console.log(`Server started on port ${port}`));