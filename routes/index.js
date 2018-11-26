// import different routes
var bodyParser = require('body-parser');

// basic setup
const app = require('express')();
const homeFolder = require('path').join(__dirname, '..');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes setup


module.exports = {app, homeFolder};
