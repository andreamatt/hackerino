const students = require('../students');
const util = require('../utility');
const Request = util.Request;
const Response = util.Response;
const students_GET = students.students_GET;

describe("/students GET empty", () => {
	test("With no query", () => {
		let request = new Request();
		let response = students_GET(request);
		expect(response.json.tot_students).toBe(0);
		expect(response.json.students).toEqual([]);
	});
	test("With good limit and offset", () => {
		let request = new Request();
		request.query = { limit: 2, offset: 9 };
		let response = students_GET(request);
		expect(response.json.tot_students).toBe(0);
		expect(response.json.students).toEqual([]);
	});
});

