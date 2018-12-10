const teachers_list = require('./teachers').teachers_list;
const util = require('../utility');
const Response = util.Response;
const Request = util.Request;
const isInteger = util.isInteger;
const teachers_teacherID_exams_GET = require('./teachers_teacherID_exams_GET');
const exams_examID_teachers_teacherID_DELETE = require('../exams/exams_examID_teachers_teacherID_DELETE');

function teachers_teacherID_DELETE(req) {
	let id = util.toInt(req.params.teacherID);
	if (!isInteger(id)) {
		return new Response(400, "Bad id path parameter");
	}
	if (!teachers_list[id]) {
		return new Response(404, "Could not remove the teacher with the specified ID (teacher not found).");
	}

	// remove teacher from exam
	let teach_req = new Request();
	teach_req.params.teacherID = id;
	let exams = teachers_teacherID_exams_GET(teach_req).json.exams;
	for (exam of exams) {
		let exam_req = new Request();
		exam_req.params.examID = exam.id;
		exam_req.params.teacherID = id;
		exams_examID_teachers_teacherID_DELETE(exam_req);
	}

	delete teachers_list[id];
	return new Response(204, "Teacher removed");
}

module.exports = teachers_teacherID_DELETE;