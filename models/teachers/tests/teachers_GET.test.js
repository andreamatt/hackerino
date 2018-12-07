const util = require('../../utility');
const Request = util.Request;
const teachers_GET = require('../teachers_GET');

describe("/teachers GET empty", () => {
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
	request.query = { offset: -1 };
	response = teachers_GET(request);
	expect(response.status).toBe(400);

	request = new Request();
	request.query = { limit: "1" };
	response = teachers_GET(request);
	expect(response.status).toBe(400);

	request = new Request();
	request.query = { offset: {} };
	response = teachers_GET(request);
	expect(response.status).toBe(400);
});