// import different routes
const exams = require("./exams");
const reviews = require("./reviews");
const students = require("./students");
const submissions = require("./submissions");
const tasks = require("./tasks");
const teachers = require("./teachers");

// basic setup
const app = require('express')();
const bodyParser = require('body-parser');
//const homeFolder = require('path').join(__dirname, '..');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// logging
app.use((req, res, next) => {
	console.log(`Params: ${JSON.stringify(req.params)}`);
	console.log(`Query: ${JSON.stringify(req.query)}`);
	console.log(`Body: ${JSON.stringify(req.body)}\n`);
	next();
});


const V = process.env.APIVERSION;

// routes setup
app.use(`/${V}/`, exams);
app.use(`/${V}/`, reviews);
app.use(`/${V}/`, students);
app.use(`/${V}/`, submissions);
app.use(`/${V}/`, tasks);
app.use(`/${V}/`, teachers);

module.exports = app;
