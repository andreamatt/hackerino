const students_list = require('./students').students_list;
const util = require('../utility');
const Response = util.Response;
const isInteger = util.isInteger;

function students_studentID_DELETE(req) {
	let id = util.toInt(req.params.studentID);
	if (!isInteger(id)) return new Response(400, "Bad id path parameter");

	if (students_list[id]) {
		delete students_list[id];
		return new Response(204, "Student removed");
	} else {
		return new Response(404, "Could not remove the student with the specified ID (student not found).");
	}
}

module.exports = students_studentID_DELETE;