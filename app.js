<<<<<<< HEAD
var express = require("express");
var path = require('path');
=======
var express = require("express"),
	path = require('path'),
	bodyParser = require('body-parser'),
	exams = require('./routes/exams'),
	reviews = require('./routes/reviews'),
	submissions = require('./routes/submissions'),
	teachers = require('./routes/teachers'),
	students = require('./routes/students'),
	tasks = require('./routes/tasks');

>>>>>>> efea65e... added missing methods to /students

var port = process.env.PORT || 3000;

const app = express();

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname + '/info.html'));
});

app.get("/help", (req, res) => {
	res.sendFile(path.join(__dirname + '/help.html'));
<<<<<<< HEAD
=======
});

//app.use("/exams",exams);
//app.use("/reviews",reviews);
//app.use("/submissions",submissions);
//app.use("/teachers",teachers);
app.use("/v1/", students);
//app.use("/tasks",tasks);
>>>>>>> efea65e... added missing methods to /students

});

var server = app.listen(port, () => console.log("server running"));

module.exports.server = server
