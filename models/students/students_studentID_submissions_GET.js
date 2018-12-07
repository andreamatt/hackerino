const submissions_GET = require('../exams/submissions_GET');
const util = require('../utility');
const isInteger = util.isInteger;
const Request = util.Request;
const Response = util.Response;

function students_studentID_submissions_GET(req) {
	let id = util.toInt(req.params.studentID);
	if (!isInteger(id)) return new Response(404, "Bad studentID parameter");
	if (!students_list[id]) return new Response(404, "Student not found");

	let subs_req = new Request();
	let result = submissions_GET(subs_req).exams.filter(sub => {
		return sub.studentID === id;
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

module.exports = students_studentID_submissions_GET;