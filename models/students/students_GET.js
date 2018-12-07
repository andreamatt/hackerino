const students_list = require('./students').students_list;
const util = require('../utility');
const Response = util.Response;
const isString = util.isString;
const isInteger = util.isInteger;
const doOffset = util.doOffset;
const doLimit = util.doLimit;

function students_GET(req) {
	let result = Object.values(students_list);
	let email = req.query.email;
	if (email !== undefined) {
		if (!isString(email)) {
			return new Response(400, "Bad email query");
		}
		result = result.filter(stud => stud.email === email);
	}
	let tot = result.length;
	let offset = req.query.offset;
	if (offset !== undefined) {
		if (!isInteger(offset)) {
			return new Response(400, "Bad offset query");
		}
		if (offset < 0) {
			return new Response(400, "Offset is negative");
		}
		result = doOffset(result, offset);
	}
	let limit = req.query.limit;
	if (limit !== undefined) {
		if (!isInteger(limit)) {
			return new Response(400, "Bad limit query");
		}
		if (limit < 0) {
			return new Response(400, "Limit is negative");
		}
		result = doLimit(result, limit);
	}
	return new Response(200, { tot_students: tot, students: result });
}

module.exports = students_GET;