const express = require('express');
const uuid = require('uuid');//A package that lets us create a random ID
const router = express.Router();

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
    var score = req.params.score;

    console.log("Score is " + score);
    console.log("Once again, the username is " + username + " and the grade is " + grade);

    return res.redirect('/leaderboard.html');
});

// router.post('/', (req, res) => {
//     var reqbody = {requestBody: req.body};

//     var score = req.body.score;
//     console.log("Score is " + score);

//     return res.redirect('http://localhost:5000/leaderboard.html');
// });

module.exports = router;