const moment = require('moment'); //This allows the file to grab the time of access (current time)

const logger = (req, res, next) => {
    console.log('A Request Has Just Been Made:');
    console.log(`${req.protocol}://${req.get('host')}${
        req.originalUrl
    }: ${moment().format()}`);
    //Could actually maybe like save every single log into a file using Node FS
    next();
};

module.exports = logger;