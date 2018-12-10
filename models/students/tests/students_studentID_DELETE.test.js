const util = require('../../utility');
const Request = util.Request;
const students_studentID_DELETE = require('../students_studentID_DELETE');
const students_studentID_GET = require('../students_studentID_GET');
const resetDB = require('../../sampleDB').resetDB;

beforeEach(resetDB);

describe("students/studentID DELETE", () => {

	test("with ok param", () => {
		let request = new Request();
		request.params = { studentID: 1 };
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
		request.params = { studentID: 9.2 };
		let response = students_studentID_DELETE(request);
		expect(response.status).toBe(400);

	});

	test("with not existing studentID", () => {
		let request = new Request();
		request.params = { studentID: 99 };
		let response = students_studentID_DELETE(request);
		expect(response.status).toBe(404);

	});

});
