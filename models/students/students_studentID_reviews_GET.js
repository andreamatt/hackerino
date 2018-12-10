const reviews_GET = require('../reviews/reviews_GET');
const students_list = require('./students').students_list;
const util = require('../utility');
const isInteger = util.isInteger;
const Request = util.Request;
const Response = util.Response;

function students_studentID_reviews_GET(req) {
	let id = util.toInt(req.params.studentID);
	if (!isInteger(id)) return new Response(404, "Bad studentID parameter");
	if (!students_list[id]) return new Response(404, "Student not found");

	let rev_req = new Request();
	let result = reviews_GET(rev_req).json.reviews.filter(rev => {
		return rev.studentID === id;
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
	return new Response(200, { tot_reviews: tot, reviews: result });
}

module.exports = students_studentID_reviews_GET;