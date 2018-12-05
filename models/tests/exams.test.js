const exams = require('../exams');
const util = require('../utility');
const Request = util.Request;
const exams_GET = exams.exams_GET;
const exams_examID_GET = exams.exams_examID_GET;
const exams_POST = exams.exams_POST;

beforeAll(() => {
	describe("/exams GET empty", () => {
		test("With no query", () => {
			let request = new Request();
			let response = exams_GET(request);
			expect(response.status).toBe(200);
			expect(response.text).toBeNull();
			expect(response.json.tot_exams).toBe(0);
			expect(response.json.exams).toEqual([]);
		});
		test("With good limit and offset", () => {
			let request = new Request();
			request.query = { limit: 2, offset: 9 };
			let response = exams_GET(request);
			expect(response.status).toBe(200);
			expect(response.text).toBeNull();
			expect(response.json.tot_exams).toBe(0);
			expect(response.json.exams).toEqual([]);
		});
	});
});

describe("exams_GET", () => {
	test("exam GET bad offset", () => {
		let request = new Request();
		request.query = { offset: "a" };
		let response = exams_GET(request);

		expect(response.status).toBe(400);
	});

	test("exam GET bad limit", () => {
		let request = new Request();
		request.query = { limit: "a" };
		let response = exams_GET(request);

		expect(response.status).toBe(400);
	});

	test("exam GET negative offset", () => {
		let request = new Request();
		request.query = { offset: -1 };
		let response = exams_GET(request);

		expect(response.status).toBe(400);
	});

	test("exam GET bad limit", () => {
		let request = new Request();
		request.query = { limit: -1 };
		let response = exams_GET(request);

		expect(response.status).toBe(400);
	});

	test("exam GET good limit", () => {
		let request = new Request();
		request.query = { limit: 10 };
		let response = exams_GET(request);

		expect(response.status).toBe(200);
	});

	test("exam GET good offset", () => {
		let request = new Request();
		request.query = { offset: 10 };
		let response = exams_GET(request);

		expect(response.status).toBe(200);
	});
});

describe("/exams_POST", () => {
	test("exams_POST working", () => {
		let request = new Request();
		request.body.date = "2001/10/10";
		request.body.deadline = "2002/10/10";
		request.body.review_deadline = "2003/10/10";
		let response = exams_POST(request);

		expect(response.status).toBe(201);
	});

	test("exams_POST date > deadline", () => {
		let request = new Request();
		request.body.date = "2003/10/10";
		request.body.deadline = "2002/10/10";
		request.body.review_deadline = "2003/10/10";
		let response = exams_POST(request);

		expect(response.status).toBe(400);
	});

	test("exams_POST with bad date", () => {
		let request = new Request();
		request.body.date = "andrea matte";
		request.body.deadline = "2002/10/10";
		request.body.review_deadline = "2003/10/10";
		let response = exams_POST(request);

		expect(response.status).toBe(400);
	});

	test("exams_POST with bad deadline", () => {
		let request = new Request();
		request.body.date = "2001/10/10";
		request.body.deadline = "andrei diaconu";
		request.body.review_deadline = "2003/10/10";
		let response = exams_POST(request);

		expect(response.status).toBe(400);
	});

	test("exams_POST with bad review_deadline", () => {
		let request = new Request();
		request.body.date = "2001/10/10";
		request.body.deadline = "2002/10/10";
		request.body.review_deadline = "andrea iossa";
		let response = exams_POST(request);

		expect(response.status).toBe(400);
	});

});

describe("/exams_examID_GET", () => {
	test("exams_exam_GET with id parameter string", () => {
		let request = new Request();
		request.params.examID = "q";
		let response = exams_examID_GET(request);

		expect(response.status).toBe(404);
	});

	test("exams_exam_GET with non existing id", () => {
		let request = new Request();
		request.params.examID = "99";
		let response = exams_examID_GET(request);

		expect(response.status).toBe(404);
	});

	test("exams_exam_GET with (non?!?!) existing id", () => {
		let request = new Request();
		request.body.date = "2001/10/10";
		request.body.deadline = "2002/10/10";
		request.body.review_deadline = "2003/10/10";
		let response = exams_POST(request);
		expect(response.status).toBe(201);
		let id = response.json.id;

		let req = new Request();
		req.params.examID = id;
		let res = exams_examID_GET(req);
		expect(res.status).toBe(200);
	});
});