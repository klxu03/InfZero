//Pseudocode for dynamic html
/* element
<table id="tbody"></table>
let el = document.getElementById("tbody")
for entry in arr
html = "<tr><td>entry.name</td><td>entry.score</td></tr>"
el.innerHTML = el.innerHTML + html */

//This is the Element for inserting things into the Table Body
let el = document.getElementById("tableBody");
var newHTML = ''; //The Variable for the HTML I'm About to Add

const { Client } = require("pg");

//Connects to the PostgreSQL database
const con = new Client({
connectionString: process.env.DATABASE_URL,
ssl: true
});

con.connect(err => {
if (err) console.error("Connection error", err.stack)
})

$(() => {
    $.ajax({
        url: '/get_leaderboard',
        method: 'GET',
        success: data => {
            console.log(data['data']);
        }
    })
});

for (var i = 1; i < 11; i++) {
newHTML += '<tr><th scope = "row">' + i + '</th><td>';
con.query(`SELECT * FROM allTimeLeaderboard WHERE position = ${i}`, (err, rows) => {
    rows = rows['rows'];
    let username = rows[0].username;
    newHTML += '' + username + '</td><td>';
    let score = rows[0].score;
    newHTML += '' + score + '</td><td>';
    let grade = rows[0].grade;
    newHTML += '' + grade + '</td></tr>'
});
}

//Adding in the table rows
console.log("New HTML is " + newHTML);
el.innerHTML = newHTML;