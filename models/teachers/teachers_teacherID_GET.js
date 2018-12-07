const teachers_list = require('./teachers').teachers_list;
const util = require('../utility');
const Response = util.Response;
const isInteger = util.isInteger;

function teachers_teacherID_GET(req) {
	let id = util.toInt(req.params.teacherID);
	if (!isInteger(id)) return new Response(404, "Bad teacherID parameter");
	if (!teachers_list[id]) return new Response(404, "Teacher not found");

	return new Response(200, teachers_list[id]);
}

module.exports = teachers_teacherID_GET;