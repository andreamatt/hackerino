const util = require('./utility');
const Response = util.Response;
const isString = util.isString;
const isInteger = Number.isInteger;
const doOffset = util.doOffset;
const doLimit = util.doLimit;
////////////////////////////////////////////////////
const students_list = {};

function Student(email, first_name, last_name) {
	this.id = 1;
	while (students_list[this.id]) {
		this.id++;
	}
	this.email = email;
	this.first_name = first_name;
	this.last_name = last_name;
}

function students_GET(req) {
	let result = Object.values(students_list);
	let email = req.query.email;
	if (email !== undefined) {
		if (!isString(email)) {
			return new Response(400, "Bad email query", null);
		}
		result = result.filter(stud => stud.email === email);
	}
	let tot = result.length;
	let offset = req.query.offset;
	if (offset !== undefined) {
		if (!isInteger(offset)) {
			return new Response(400, "Bad offset query", null);
		}
		if (offset < 0) {
			return new Response(400, "Offset is negative", null);
		}
		result = doOffset(result, offset);
	}
	let limit = req.query.limit;
	if (limit !== undefined) {
		if (!isInteger(limit)) {
			return new Response(400, "Bad limit query", null);
		}
		if (limit < 0) {
			return new Response(400, "Limit is negative", null);
		}
		result = doLimit(result, limit);
	}
	return new Response(200, null, { tot_students: tot, students: result });
}

function students_POST(req) {
	let email = req.body.email;
	let first_name = req.body.first_name;
	let last_name = req.body.last_name;
	if (!isString(email)) return new Response(400, "Bad email body parameter", null);
	if (!isString(first_name)) return new Response(400, "Bad first_name body parameter", null);
	if (!isString(last_name)) return new Response(400, "Bad last_name body parameter", null);

	let byEmail = Object.values(students_list).filter(stud => stud.email === email);
	if (byEmail.length > 0) {
		return new Response(423, "A student with such email already exists", null);
	}

	let stud = new Student(email, first_name, last_name);
	students_list[stud.id] = stud;
	return new Response(201, null, stud);
}

function students_studentID_GET(req) {
	let id = parseInt(req.params.studentID);
	if (!isInteger(id)) {
		return new Response(404, "Bad studentID parameter", null);
	}
	if (!students_list[id]) {
		return new Response(404, "Student not found", null);
	}
	return new Response(200, null, students_list[id]);
}

function students_studentID_PUT(req) {
	let id = parseInt(req.query.studentID);
	let email = req.body.email;
	let first_name = req.body.first_name;
	let last_name = req.body.last_name;

	if (!isInteger(id)) return new Response(400, "Bad id path parameter", null);
	if (!isString(email)) return new Response(400, "Bad email body parameter", null);
	if (!isString(first_name)) return new Response(400, "Bad first_name body parameter", null);
	if (!isString(last_name)) return new Response(400, "Bad last_name body parameter", null);

	if (students_list[id]) {
		students_list[id].first_name = first_name;
		students_list[id].last_name = last_name;
		return new Response(200, null, students_list[id]);
	} else {
		let withEmail = Object.values(students_list).filter(stud => stud.email === email);
		if (withEmail.length > 0) {
			return new Response(423, "A student with such email already exists", null);
		}
		let student = new Student(email, first_name, last_name);
		student.id = id;
		students_list[id] = student;
		return new Response(201, null, student);
	}
}

function students_studentID_DELETE(req) {
	let id = parseInt(req.params.studentID);
	if (!isInteger(id)) return new Response(400, "Bad id path parameter", null);

	if (students_list[id]) {
		delete students_list[id];
		return new Response(204, "student removed", null);
	} else {
		return new Response(404, "Could not remove the student with the specified ID (student not found).", null);
	}
}

module.exports = { students_GET, students_POST, students_studentID_GET, students_studentID_PUT, students_studentID_DELETE };
