const students_studentID_submissions_GET = require('../students_studentID_submissions_GET');
const resetDB = require('../../sampleDB').resetDB;
const util = require('../../utility');
const Request = util.Request;

beforeEach(resetDB);

describe("students/id/submissions GET", () => {

	test("with good params", () => {
		let request = new Request();
		request.params.studentID = 7;
		let response = students_studentID_submissions_GET(request);
		expect(response.status).toBe(200);
		let submissions = response.json.submissions;
		expect(submissions.length).toBe(response.json.tot_submissions);
		expect(submissions.length).toBe(2);
		expect(submissions.every(util.isSubmission)).toBe(true);
	});

	test("with good params and offset-limit", () => {
		let request = new Request();
		request.params.studentID = 7;
		request.query = { offset: 1, limit: 1 };
		let response = students_studentID_submissions_GET(request);
		expect(response.status).toBe(200);
		let submissions = response.json.submissions;
		expect(submissions.length).toBe(1);
		expect(submissions.every(util.isSubmission)).toBe(true);
		expect(submissions[0].id).toBe(4);
	});

	test("with bad params", () => {
		let request = new Request();
		request.params.studentID = 999;
		let response = students_studentID_submissions_GET(request);
		expect(response.status).toBe(404);
	});

	test("with bad params", () => {
		let request = new Request();
		request.params.studentID = "asd";
		let response = students_studentID_submissions_GET(request);
		expect(response.status).toBe(404);
	});

	test("with bad params", () => {
		let request = new Request();
		request.params.studentID = 1;
		request.query = { offset: "a" };
		let response = students_studentID_submissions_GET(request);
		expect(response.status).toBe(400);
	});

	test("with bad params", () => {
		let request = new Request();
		request.params.studentID = 1;
		request.query = { limit: "a" };
		let response = students_studentID_submissions_GET(request);
		expect(response.status).toBe(400);
	});

	test("with bad params", () => {
		let request = new Request();
		request.params.studentID = 1;
		request.query = { offset: "-1" };
		let response = students_studentID_submissions_GET(request);
		expect(response.status).toBe(400);
	});

	test("with bad params", () => {
		let request = new Request();
		request.params.studentID = 1;
		request.query = { limit: "-10" };
		let response = students_studentID_submissions_GET(request);
		expect(response.status).toBe(400);
	});

});