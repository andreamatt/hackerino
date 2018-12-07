const teachers_list = require('./teachers').teachers_list;
const util = require('../utility');
const Response = util.Response;
const isInteger = util.isInteger;

function teachers_teacherID_DELETE(req) {
	let id = util.toInt(req.params.teacherID);
	if (!isInteger(id)) return new Response(400, "Bad id path parameter");

	if (teachers_list[id]) {
		delete teachers_list[id];
		return new Response(204, "Teacher removed");
	} else {
		return new Response(404, "Could not remove the teacher with the specified ID (teacher not found).");
	}
}

module.exports = teachers_teacherID_DELETE;