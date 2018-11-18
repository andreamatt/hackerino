var router = require('express').Router();
var students = require('../models/students');

router
    .get("/students", (req, res) => {
		console.log(`\n/students GET`);
		res.status(200);
        res.json(students.getAllStudents());
    })
    .post("/students", (req, res) => {
        let email = req.body.email;
        let firstname = req.body.firstname;
        let lastname = req.body.lastname;
		console.log(`\n/students POST ${email}, ${firstname}, ${lastname}`);
        let stud = students.addStudent(email, firstname, lastname);
        if(stud){
			res.status(201);
			res.json(stud);
		} else {
			res.status(400);
			res.send("Bad request");
		}
    })
    .get("/students/:studentID", (req, res) => {
		let id = parseInt(req.params.studentID);
		console.log(`\n/students/${id} GET`);
        let stud = students.getById(id);
		if(stud){
			res.status(200);
			res.json(stud);
		} else {
			res.status(404);
			res.send(`Student with id=${id} not found`);
		}
    })
    .put("/students/:studentID", (req, res) => {
		let id = parseInt(req.params.studentID);
		console.log(`\n/students/${id} PUT: ${req.body.email}, ${req.body.firstname}, ${req.body.lastname}`);
		let updated = students.updateStudent(id, req.body.email, req.body.firstname, req.body.lastname);
        if (updated) {
			res.status(200);
            res.send("Student updated");
        } else {
			students.addStudentWithID(id, req.body.email, req.body.firstname, req.body.lastname);
            res.status(201);
            res.send("Student not found therefore created");
        }
	})
	.delete("/students/:studentID", (req, res) => {
		let id = parseInt(req.params.studentID);
		console.log(`\n/students/${id} DELETE`);
		if(students.deleteStudent(id)){
			res.status(204);
			res.send();
		} else {
			res.status(404);
			res.send("Student not found");
		}
	});

module.exports = router;
