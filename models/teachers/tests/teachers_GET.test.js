const util = require('../../utility');
const Request = util.Request;
const teachers_GET = require('../teachers_GET');
const resetDB = require('../../sampleDB').resetDB;

beforeEach(resetDB);

describe("/teachers GET", () => {
	test("With no query", () => {
		let request = new Request();
		let response = teachers_GET(request);
		expect(response.status).toBe(200);
	});
	test("With good limit and offset", () => {
		let request = new Request();
		request.query = { limit: 2, offset: 9 };
		let response = teachers_GET(request);
		expect(response.status).toBe(200);
	});
	test("With email query", () => {
		let request = new Request();
		request.query = { email: "fabio.casati@unitn.it" };
		let response = teachers_GET(request);
		expect(response.status).toBe(200);
		expect(response.json.teachers.length).toBe(1);
	});
});

describe("teachers GET with wrong parameters", () => {
	let request = new Request();
	request.query = { email: "" };
	let response = teachers_GET(request);
	expect(response.status).toBe(400);

	request = new Request();
	request.query = { email: 1 };
	response = teachers_GET(request);
	expect(response.status).toBe(400);

	request = new Request();
	request.query = { limit: -1 };
	response = teachers_GET(request);
	expect(response.status).toBe(400);

	request = new Request();
	request.query = { offset: "-1" };
	response = teachers_GET(request);
	expect(response.status).toBe(400);

	request = new Request();
	request.query = { limit: "1" };
	response = teachers_GET(request);
	expect(response.status).toBe(200);

	request = new Request();
	request.query = { limit: "asd" };
	response = teachers_GET(request);
	expect(response.status).toBe(400);

	request = new Request();
	request.query = { offset: {} };
	response = teachers_GET(request);
	expect(response.status).toBe(400);
});