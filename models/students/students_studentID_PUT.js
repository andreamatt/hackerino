const students_list = require('./students').students_list;
const Student = require('./students').Student;
const util = require('../utility');
const Response = util.Response;
const isString = util.isString;
const isInteger = util.isInteger;

function students_studentID_PUT(req) {
	let id = util.toInt(req.params.studentID);
	let email = req.body.email;
	let first_name = req.body.first_name;
	let last_name = req.body.last_name;

	if (!isInteger(id)) return new Response(400, "Bad id path parameter");
	if (!isString(email)) return new Response(400, "Bad email body parameter");
	if (!isString(first_name)) return new Response(400, "Bad first_name body parameter");
	if (!isString(last_name)) return new Response(400, "Bad last_name body parameter");

	if (students_list[id]) {
		if (students_list[id].email !== email) {
			return new Response(400, `Passed email (${email}) is different from student ${id}'s email(${students_list[id].email})`);
		}
		students_list[id].first_name = first_name;
		students_list[id].last_name = last_name;
		return new Response(200, "Student updated");
	} else {
		let withEmail = Object.values(students_list).filter(stud => stud.email === email);
		if (withEmail.length > 0) {
			return new Response(423, "A student with such email already exists");
		}
		let student = new Student(email, first_name, last_name);
		student.id = id;
		students_list[id] = student;
		return new Response(201, "Student created");
	}
}

module.exports = students_studentID_PUT;