const util = require('../../utility');
const Request = util.Request;
const teachers_teacherID_GET = require('../teachers_teacherID_GET');
const resetDB = require('../../sampleDB').resetDB;

beforeEach(resetDB);

describe("teachers/teacherID GET", () => {

	let id = 1;
	test("with ok param", () => {
		let request = new Request();
		request.params = { teacherID: id };
		let response = teachers_teacherID_GET(request);
		expect(response.status).toBe(200);
		expect(response.json.id).toBe(id);
	});

	test("with bad param", () => {
		let request = new Request();
		request.params = { teacherID: "asd" };
		let response = teachers_teacherID_GET(request);
		expect(response.status).toBe(404);

	});

	test("with bad param", () => {
		let request = new Request();
		request.params = { teacherID: 9.2 };
		let response = teachers_teacherID_GET(request);
		expect(response.status).toBe(404);

	});

	test("with non-ex id", () => {
		let request = new Request();
		request.params = { teacherID: 99999999 };
		let response = teachers_teacherID_GET(request);
		expect(response.status).toBe(404);

	});
});