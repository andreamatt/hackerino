const exams_GET = require('../exams/exams_GET');
const exams_examID_teachers_GET = require('../exams/exams_examID_teachers_GET');
const util = require('../utility');
const isInteger = util.isInteger;
const Request = util.Request;
const Response = util.Response;

function teachers_teacherID_exams_GET(req) {
	let id = util.toInt(req.params.teacherID);
	if (!isInteger(id)) return new Response(404, "Bad teacherID parameter");
	if (!teachers_list[id]) return new Response(404, "Teacher not found");

	let exams_req = new Request();
	let result = exams_GET(exams_req).exams.filter(exam => {
		let stud_req = new Request();
		stud_req.params.examID = exam.id;
		let teachers = exams_examID_teachers_GET(stud_req).teachers;
		return teachers.filter(teacher => teacher.id === id).length > 0;
	});

	let tot = result.length;
	let offset = req.query.offset;
	if (offset !== undefined) {
		offset = util.toInt(offset);
		if (!isInteger(offset)) {
			return new Response(400, "Bad offset query");
		}
		if (offset < 0) {
			return new Response(400, "Offset is negative");
		}
		result = util.doOffset(result, offset);
	}
	let limit = req.query.limit;
	if (limit !== undefined) {
		limit = util.toInt(limit);
		if (!isInteger(limit)) {
			return new Response(400, "Bad limit query");
		}
		if (limit < 0) {
			return new Response(400, "Limit is negative");
		}
		result = util.doLimit(result, limit);
	}
	return new Response(200, { tot_exams: tot, exams: result });
}

module.exports = teachers_teacherID_exams_GET;