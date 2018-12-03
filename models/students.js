const util = require('./utility');
const Response = util.Response;
const isString = util.isString;
const isInteger = Number.isInteger;
const doOffset = util.doOffset;
const doLimit = util.doLimit;
////////////////////////////////////////////////////
const students_list = {};

function Student(email, firstname, lastname) {
	this.id = 1;
	while (students_list[id]) {
		this.id++;
	}
	this.email = email;
	this.firstname = firstname;
	this.lastname = lastname;
}

function students_GET(req) {
	let result = Object.values(students_list);
	let email = req.query.email;
	if (email) {
		if (!isString(email)) {
			return new Response(400, "Bad email query", null);
		}
		result = result.filter(stud => stud.email === email);
	}
	let tot = result.length;
	let offset = req.query.offset;
	if (offset) {
		if (!isInteger(offset)) {
			return new Response(400, "Bad offset query", null);
		}
		if (offset < 0) {
			return new Response(400, "Offset is negative", null);
		}
		result = doOffset(result, offset);
	}
	let limit = req.query.limit;
	if (limit) {
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

module.exports = { students_GET };