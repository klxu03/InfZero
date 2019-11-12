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

    var condition = true;
    for (var i = 1; i < 502; i++) {
        condition = false;
        con.query(`INSERT INTO allTimeLeaderboard (position, username, score, grade, date, time) 
        VALUES (${i}, 'PlaceHolder', 10, 'Mysterious', 'The Big Bang', 'The Big Bang')`);
    }

    //Makes sure that the previous insert 500 rows gets triggered first
    if (!condition) return res.redirect('/game.html');
});

router.get('/leaderboard/:score', (req, res) => {
    console.log("/leaderboard Request received");
    var reqbody = {requestBody: req.body};
    var runScore = req.params.score;

    console.log("Score is " + runScore);
    console.log("Once again, the username is " + username + " and the grade is " + grade);

    //Goes ahead and finds the time of this request, (could store every single time in NodeFS?)
    var timeOfLeaderboardReq = "" + `${moment().format()}`;
    var date = timeOfLeaderboardReq.substring(0, 10);
    var tiempo = timeOfLeaderboardReq.substring(11, 19);

    console.log("Date is " + date);
    console.log("The Time is " + tiempo);

    //Third times the charm, firstly updating all positions where it is less than runScore
    con.query(`UPDATE allTimeLeaderboard SET position = (position + 1) WHERE score < ${runScore}`, (err) => {
        if (err) throw err;
    });

    con.query(`SELECT * FROM allTimeLeaderboard WHERE score < ${runScore}`, (err, rows) => {
        rows = rows['rows'];
        console.log('rows.length is ' + rows.length);
        var newPosition = 501 - rows.length;

        var query = {
            text: 'INSERT INTO allTimeLeaderboard(position, username, score, grade, date, time) VALUES($1, $2, $3, $4, $5, $6)',
            values: [newPosition, username, runScore, grade, date, tiempo],
        }
        con.query(query);
    });

    con.query('DELETE * FROM allTimeLeaderboard WHERE position = 501', (err) => {
        if (err) throw err;
    });

    //Another failed attempt, but Kevin Higgs suggest an amazing new idea
    //Grabs every one's score that is under the player's scores
    // con.query(`SELECT * FROM allTimeLeaderboard WHERE score < ${runScore}`, (err, rows) => {
    //     rows = rows['rows'];
    //     var numOfMore = rows.length;

    //     //Goes ahead and changes every single row underneath the current player's row
    //     for(var i = (501 - numOfMore); i < 501; i++) {
    //         con.query(`SELECT * FROM allTimeLeaderboard WHERE position = ${i}`, (err, rows2) => {
    //             rows2 = rows2['rows'];

    //             var query = {
    //                 text: 'UPDATE allTimeLeaderboard SET position = $1, username = $2, score = $3, grade = $4, date = $5, time = $6',
    //                 values: [(501 - rows2[0].position), rows2[0].username, rows2[0].score, grade, date, tiempo],
    //             }

    //             con.query(query);
    //         })
    //     }

    //     //Inserts the player's score
        // var query = {
        //     text: 'INSERT INTO allTimeLeaderboard(position, username, score, grade, date, time) VALUES($1, $2, $3, $4, $5, $6)',
        //     values: [(501 - numOfMore), username, runScore, grade, date, tiempo],
        // }
        // con.query(query);
    // });

    //Relics from not working with Kevin Higgs

    // var place = 505;
    // for (var i = 1; i < 500; i++) {
    //     con.query(`SELECT * FROM allTimeLeaderboard WHERE position = ${i}`, (err, rows) => {
    //         rows = rows['rows'];
    //         let currScore = rows[0].score;
    //         if (runScore > currScore && place < rows[0].place) {
    //             place = rows[0].position;
    //         }
    //     });
    // }

    // if (place != 505) {//As long as the new person actually placed in the top 500
    //     //This goes ahead and replaces all the previous rows with an extra number in position since everything gets moved down by one
    //     con.query(`INSERT INTO allTimeLeaderboard (position, username, score, grade, date, time) VALUES (${place}, ${username}, ${runScore}, ${grade}, ${date}, ${tiempo})`);
    //     for (var i = place + 1; i < 500; i++) {
    //         con.query(`SELECT * FROM allTimeLeaderboard WHERE position = ${i}`, (err, rows) => {
    //             rows = rows['rows'];
    //             var thisPosition = rows[0].position;
    //             con.query(`UPDATE allTimeLeaderboard SET position = ${thisPosition + 1}`);
    //         });
    //     }
    //     con.query('DELETE FROM allTimeLeaderboard WHERE position = 501');
    // }

    // //Just in case, resetting place to 505
    // place = 505;

    return res.redirect('/leaderboard.html');
});

module.exports = router;