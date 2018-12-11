const util = require('../../utility');
const Request = util.Request;
const teachers_teacherID_DELETE = require('../teachers_teacherID_DELETE');
const teachers_teacherID_GET = require('../teachers_teacherID_GET');
const resetDB = require('../../sampleDB').resetDB;

beforeEach(resetDB);

describe("teachers/teacherID DELETE", () => {

	test("with ok param", () => {
		let request = new Request();
		request.params = { teacherID: "1" };
		let response = teachers_teacherID_DELETE(request);
		expect(response.status).toBe(204);

		// getting to check it was deleted
		response = teachers_teacherID_GET(request);
		expect(response.status).toBe(404);
	});

	test("with bad param", () => {
		let request = new Request();
		request.params = { teacherID: "asd" };
		let response = teachers_teacherID_DELETE(request);
		expect(response.status).toBe(400);

	});

	test("with bad param", () => {
		let request = new Request();
		request.params = { teacherID: "9.2" };
		let response = teachers_teacherID_DELETE(request);
		expect(response.status).toBe(400);

	});

	test("with not existing teacherID", () => {
		let request = new Request();
		request.params = { teacherID: "99" };
		let response = teachers_teacherID_DELETE(request);
		expect(response.status).toBe(404);

	});

});
