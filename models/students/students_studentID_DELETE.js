const students_list = require('./students').students_list;
const util = require('../utility');
const Response = util.Response;
const Request = util.Request;
const isInteger = util.isInteger;
const students_studentID_exams_GET = require('./students_studentID_exams_GET');
const exams_examID_students_studentID_DELETE = require('../exams/exams_examID_students_studentID_DELETE');
const submissions = require('../submissions/submissions');
const reviews = require('../reviews/reviews');
const students_studentID_submissions_GET = require('./students_studentID_submissions_GET');
const students_studentID_reviews_GET = require('./students_studentID_reviews_GET');

function students_studentID_DELETE(req) {
	let id = util.toInt(req.params.studentID);
	if (!isInteger(id)) {
		return new Response(400, "Bad id path parameter");
	}
	if (!students_list[id]) {
		return new Response(404, "Could not remove the student with the specified ID (student not found).");
	}

	// remove student from exam
	let stud_req = new Request();
	stud_req.params.studentID = id;
	let exams = students_studentID_exams_GET(stud_req).json.exams;
	for (exam of exams) {
		let exam_req = new Request();
		exam_req.params.examID = exam.id;
		exam_req.params.studentID = id;
		exams_examID_students_studentID_DELETE(exam_req);
	}

	// remove student's submissions
	let subs = students_studentID_submissions_GET(stud_req).json.submissions;
	for (sub of subs) {
		submissions.forceDelete_submission(sub.id);
	}

	// remove student's reviews
	let revs = students_studentID_reviews_GET(stud_req).json.reviews;
	for (rev of revs) {
		reviews.forceDelete_review(rev.id);
	}

	delete students_list[id];
	return new Response(204, "Student removed");
}

module.exports = students_studentID_DELETE;