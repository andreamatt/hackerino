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
app.get("/", (req, res) => {
	res.sendFile(`${homeFolder}/public/info.html`);
});

app.get("/help", (req, res) => {
	res.sendFile(`${homeFolder}/public/help.html`);
});

//app.use("/exams",exams);
//app.use("/reviews",reviews);
//app.use("/submissions",submissions);
//app.use("/teachers",teachers);
app.use("/v1/", students);
//app.use("/tasks",tasks);

module.exports = {app, homeFolder};
