"use strict";
const express = require('express');
const uuid = require('uuid');//A package that lets us create a random ID
const router = express.Router();

const moment = require('moment'); //This allows the file to grab the time of access (current time)

const { Client } = require("pg");

//Connects to the PostgreSQL database
const con = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
});

con.connect(err => {
    if (err) console.error("Connection error", err.stack)
})

var username;
var grade;

//Gets the request
router.get('/game/:username/:grade', (req, res) => {
    console.log("/game Request received");

    var reqbody = {requestBody: req.body};
    username = req.params.username;
    grade = req.params.grade;

    console.log("username is " + username);
    console.log("grade is " + grade);

    return res.redirect('/game.html');
});

router.get('/leaderboard/:score', (req, res) => {
    console.log("/leaderboard Request received");
    var reqbody = {requestBody: req.body};
    var runScore = req.params.score;

    console.log("Score is " + runScore);
    console.log("Once again, the username is " + username + " and the grade is " + grade);

    //Goes ahead and finds the time of this request, (could store every single time in NodeFS?)
    var timeOfLeaderboardReq = "" + `${moment().format()}`;

    console.log("Date is " + timeOfLeaderboardReq.substring(0, 10));
    console.log("The Time is " + timeOfLeaderboardReq.substring(11, 19));

    var place = 505;
    var conditionOfInsertion = true;
    for (var i = 1; i < 500; i++) {
        con.query(`SELECT * FROM allTimeLeaderboard WHERE position = ${i + 1}`, (err, rows) => {
            rows = rows['rows'];
            let currScore = rows[0].score;
            if (runScore > currScore && conditionOfInsertion) {
                place = rows[0].position;
                conditionOfInsertion = false;
            }
        });
    }

    if (place != 505) {//As long as the new person actually placed in the top 500
        //This goes ahead and replaces all the previous rows with an extra number in position since everything gets moved down by one
        for (var i = place + 1; i < 500; i++) {
            con.query(`SELECT * FROM allTimeLeaderboard WHERE position = ${i}`, (err, rows) => {
                rows = rows['rows'];
                var thisPosition = rows[0].position;
                con.query(`UPDATE allTimeLeaderboard SET position = ${thisPosition + 1}`);
            });
        }
    }

    //Just in case, resetting place to 505
    place = 505;

    return res.redirect('/leaderboard.html');
});

module.exports = router;