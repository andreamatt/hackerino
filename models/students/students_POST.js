const students_list = require('./students').students_list;
const Student = require('./students').Student;
const util = require('../utility');
const Response = util.Response;
const isString = util.isString;

function students_POST(req) {
	let email = req.body.email;
	let first_name = req.body.first_name;
	let last_name = req.body.last_name;
	if (!isString(email)) return new Response(400, "Bad email body parameter");
	if (!isString(first_name)) return new Response(400, "Bad first_name body parameter");
	if (!isString(last_name)) return new Response(400, "Bad last_name body parameter");

	let byEmail = Object.values(students_list).filter(stud => stud.email === email);
	if (byEmail.length > 0) {
		return new Response(423, "A student with such email already exists");
	}

	let stud = new Student(email, first_name, last_name);
	students_list[stud.id] = stud;
	return new Response(201, stud);
}

module.exports = students_POST;