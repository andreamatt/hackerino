const util = require('../../utility');
const Request = util.Request;
const students_GET = require('../students_GET');
const resetDB = require('../../sampleDB').resetDB;

beforeEach(resetDB);

describe("/students GET", () => {
	test("With no query", () => {
		let request = new Request();
		let response = students_GET(request);
		expect(response.status).toBe(200);
	});
	test("With good limit and offset", () => {
		let request = new Request();
		request.query = { limit: 2, offset: 9 };
		let response = students_GET(request);
		expect(response.status).toBe(200);
	});
	test("With email query", () => {
		let request = new Request();
		request.query = { email: "andrea.matte@studenti.unitn.it" };
		let response = students_GET(request);
		expect(response.status).toBe(200);
		expect(response.json.students.length).toBe(1);
	});
});

describe("students GET with wrong parameters", () => {
	let request = new Request();
	request.query = { email: "" };
	let response = students_GET(request);
	expect(response.status).toBe(400);

	request = new Request();
	request.query = { email: 1 };
	response = students_GET(request);
	expect(response.status).toBe(400);

	request = new Request();
	request.query = { limit: -1 };
	response = students_GET(request);
	expect(response.status).toBe(400);

	request = new Request();
	request.query = { offset: "-1" };
	response = students_GET(request);
	expect(response.status).toBe(400);

	request = new Request();
	request.query = { limit: "1" };
	response = students_GET(request);
	expect(response.status).toBe(200);

	request = new Request();
	request.query = { limit: "asd" };
	response = students_GET(request);
	expect(response.status).toBe(400);

	request = new Request();
	request.query = { offset: {} };
	response = students_GET(request);
	expect(response.status).toBe(400);
});