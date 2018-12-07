const students_list = require('./students').students_list;
const util = require('../utility');
const Response = util.Response;
const isInteger = util.isInteger;

function students_studentID_GET(req) {
	let id = util.toInt(req.params.studentID);
	if (!isInteger(id)) return new Response(404, "Bad studentID parameter");
	if (!students_list[id]) return new Response(404, "Student not found");

	return new Response(200, students_list[id]);
}

module.exports = students_studentID_GET;