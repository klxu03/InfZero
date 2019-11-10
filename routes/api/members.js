const express = require('express');
const uuid = require('uuid');//A package that lets us create a random ID
const router = express.Router();
const members = require('../../Members');//Members json consisting of people with IDs

// Gets All Members (with Postman too)
router.get('/', (req, res) => {
    res.json(members);
});

// var exist = function(member) {
//     //Checks to see if the member exists inside the json file with the ID
//     // let condition = true;
//     // console.log("#1");
//     // var equal = (member => (member.id === parseInt(req.params.id)));
//     // var equal2 = (member => (1 === parseInt(req.params.id)));
//     // console.log(equal == equal2);

//     // if((member => (member.id === parseInt(req.params.id))) == (member => (1 === 2))) {
//     //     condition = false;
//     //     console.log("If statement was triggered");
//     // };
//     // return condition;
// }

// Get Single Member
router.get('/:id', (req, res) => {
    //const found = members.some(member => member.id === parseInt(req.params.id));//If a member exists with the ID you've specified, return true. If doesn't exist, return false

    let newArr = members.filter(member => member.id === parseInt(req.params.id));

    if (newArr.length != 0) {
        res.json(newArr);
    } else {
        res.status(400).json({ msg: `No member with the id of ${req.params.id}`});
    }
});

// Create a Member with a Post Request
router.post('/', (req, res) => {
    var reqbody = {requestBody: req.body};
    const newMember = {
        id: uuid.v4(),
        name: req.body.name,
        email: req.body.email,
        status: 'active'
    }

    if (!newMember.name || !newMember.email) {
        console.log("newMember is " + newMember);
        return res.status(400).json({ msg: 'Please include a name and an email'});
    }

    members.push(newMember);//Adds on the new member into the made up array
    res.json(members);//Sends the whole members array

});

module.exports = router;