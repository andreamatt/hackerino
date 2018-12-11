const util = require('../../utility');
const Request = util.Request;
const students_studentID_DELETE = require('../students_studentID_DELETE');
const students_studentID_GET = require('../students_studentID_GET');
const submissions_submissionID_GET = require('../../submissions/submissions_submissionID_GET');
const students_studentID_submissions_GET = require('../students_studentID_submissions_GET');
const students_studentID_reviews_GET = require('../students_studentID_reviews_GET');
const resetDB = require('../../sampleDB').resetDB;

beforeEach(resetDB);

describe("students/studentID DELETE", () => {

	test("with ok param", () => {
		let request = new Request();
		request.params = { studentID: "1" };
		let response = students_studentID_DELETE(request);
		expect(response.status).toBe(204);

		// getting to check it was deleted
		response = students_studentID_GET(request);
		expect(response.status).toBe(404);
	});

	test("with bad param", () => {
		let request = new Request();
		request.params = { studentID: "asd" };
		let response = students_studentID_DELETE(request);
		expect(response.status).toBe(400);

	});

	test("with bad param", () => {
		let request = new Request();
		request.params = { studentID: "9.2" };
		let response = students_studentID_DELETE(request);
		expect(response.status).toBe(400);

	});

	test("with not existing studentID", () => {
		let request = new Request();
		request.params = { studentID: "99" };
		let response = students_studentID_DELETE(request);
		expect(response.status).toBe(404);

	});

	test("Delete student who has submissiosn", () => {
		// get submissions
		let request = new Request();
		request.params = { studentID: "7" };
		let response = students_studentID_submissions_GET(request);
		let submissions = response.json.submissions;
		expect(submissions.length).toBe(2);

		// delete student
		response = students_studentID_DELETE(request);
		expect(response.status).toBe(204);

		// check submissions were deleted
		for (sub of submissions) {
			request = new Request();
			request.params = { submissionID: sub.id.toString() };
			response = submissions_submissionID_GET(request);
			expect(response.status).toBe(404);
		}
	});

	test("Delete student who has reviews", () => {
		// get reviews
		let request = new Request();
		request.params = { studentID: "7" };
		let response = students_studentID_reviews_GET(request);
		let reviews = response.json.reviews;
		expect(reviews.length).toBe(2);

		// delete student
		response = students_studentID_DELETE(request);
		expect(response.status).toBe(204);

		// check reviews were deleted
		for (rev of reviews) {
			request = new Request();
			request.params = { reviewID: rev.id.toString() };
			response = submissions_submissionID_GET(request);
			expect(response.status).toBe(404);
		}
	});

});
