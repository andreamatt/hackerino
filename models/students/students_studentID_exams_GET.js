const exams_GET = require('../exams/exams_GET');
const exams_examID_students_GET = require('../exams/exams_examID_students_GET');
const students_list = require('./students').students_list;
const util = require('../utility');
const isInteger = util.isInteger;
const Request = util.Request;
const Response = util.Response;

function students_studentID_exams_GET(req) {
	let id = util.toInt(req.params.studentID);
	if (!isInteger(id)) return new Response(404, "Bad studentID parameter");
	if (!students_list[id]) return new Response(404, "Student not found");

	let exams_req = new Request();
	let result = exams_GET(exams_req).json.exams.filter(exam => {
		let stud_req = new Request();
		stud_req.params.examID = exam.id;
		let students = exams_examID_students_GET(stud_req).json.students;
		return students.filter(student => student.id === id).length > 0;
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

module.exports = students_studentID_exams_GET;