const util = require('../../utility');
const Request = util.Request;
const students_studentID_GET = require('../students_studentID_GET');
const resetDB = require('../../sampleDB').resetDB;

beforeEach(resetDB);

describe("students/studentID GET", () => {

	let id = 1;
	test("with ok param", () => {
		let request = new Request();
		request.params = { studentID: id };
		let response = students_studentID_GET(request);
		expect(response.status).toBe(200);
		expect(response.json.id).toBe(id);
	});

	test("with bad param", () => {
		let request = new Request();
		request.params = { studentID: "asd" };
		let response = students_studentID_GET(request);
		expect(response.status).toBe(404);

	});

	test("with bad param", () => {
		let request = new Request();
		request.params = { studentID: 9.2 };
		let response = students_studentID_GET(request);
		expect(response.status).toBe(404);

	});

	test("with non-ex id", () => {
		let request = new Request();
		request.params = { studentID: 99999999 };
		let response = students_studentID_GET(request);
		expect(response.status).toBe(404);

	});
});