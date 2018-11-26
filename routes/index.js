// import different routes
var bodyParser = require('body-parser'),
	exams = require('./exams'),
	reviews = require('./reviews'),
	submissions = require('./submissions'),
	teachers = require('./teachers'),
	students = require('./students'),
	tasks = require('./tasks');

// basic setup
const app = require('express')();
const homeFolder = require('path').join(__dirname, '..');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes setup


module.exports = {app, homeFolder};
