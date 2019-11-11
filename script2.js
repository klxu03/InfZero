const express = require('express');
const config = require("./config.json");
const path = require('path');
const bp = require('body-parser');

const logger = require('./middleware/logger');

const app = express();

app.use(logger);

const port = process.env.PORT || config.port;
console.log("Using Port:" + port);

app.use(express.static(path.join(__dirname, 'public')));

// Using the InfZero.js API to run for everything
app.use('/', require('./routes/api/infzero.js'));

const { Client } = require("pg");

//Connects to the PostgreSQL database
const con = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
});

con.connect(err => {
    if (err) console.error("Connection error", err.stack)
})

for(var i = 0; i < 50; i++) {
    con.query(`INSERT INTO allTimeLeaderboard (position, username, score, grade, date, time) VALUES (${i}, "PlaceHolder", 0, "PlaceHolder", "PlaceHolder")`);
}

// Using the InfZero.js API to run for everything
app.use('/', require('./routes/api/infzero.js'));

app.listen(port, () => console.log(`Server started on port ${port}`));
