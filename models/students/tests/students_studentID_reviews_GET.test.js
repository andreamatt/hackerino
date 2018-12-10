const students_studentID_reviews_GET = require('../students_studentID_reviews_GET');
const resetDB = require('../../sampleDB').resetDB;
const util = require('../../utility');
const Request = util.Request;

beforeEach(resetDB);

describe("students/id/reviews GET", () => {

	test("with good params", () => {
		let request = new Request();
		request.params.studentID = 7;
		let response = students_studentID_reviews_GET(request);
		expect(response.status).toBe(200);
		let reviews = response.json.reviews;
		expect(reviews.length).toBe(response.json.tot_reviews);
		expect(reviews.length).toBe(2);
		expect(reviews.every(util.isReview)).toBe(true);
	});

	test("with good params and offset-limit", () => {
		let request = new Request();
		request.params.studentID = 7;
		request.query = { offset: 1, limit: 1 };
		let response = students_studentID_reviews_GET(request);
		expect(response.status).toBe(200);
		let reviews = response.json.reviews;
		expect(reviews.length).toBe(1);
		expect(reviews.every(util.isReview)).toBe(true);
		expect(reviews[0].id).toBe(4);
	});

	test("with bad params", () => {
		let request = new Request();
		request.params.studentID = 999;
		let response = students_studentID_reviews_GET(request);
		expect(response.status).toBe(404);
	});

	test("with bad params", () => {
		let request = new Request();
		request.params.studentID = "asd";
		let response = students_studentID_reviews_GET(request);
		expect(response.status).toBe(404);
	});

	test("with bad params", () => {
		let request = new Request();
		request.params.studentID = 1;
		request.query = { offset: "a" };
		let response = students_studentID_reviews_GET(request);
		expect(response.status).toBe(400);
	});

	test("with bad params", () => {
		let request = new Request();
		request.params.studentID = 1;
		request.query = { limit: "a" };
		let response = students_studentID_reviews_GET(request);
		expect(response.status).toBe(400);
	});

	test("with bad params", () => {
		let request = new Request();
		request.params.studentID = 1;
		request.query = { offset: "-1" };
		let response = students_studentID_reviews_GET(request);
		expect(response.status).toBe(400);
	});

	test("with bad params", () => {
		let request = new Request();
		request.params.studentID = 1;
		request.query = { limit: "-10" };
		let response = students_studentID_reviews_GET(request);
		expect(response.status).toBe(400);
	});

});