const util = require('../../utility');
const Request = util.Request;
const teachers_teacherID_DELETE = require('../teachers_teacherID_DELETE');
const teachers_POST = require('../teachers_POST');

describe("teachers/teacherID DELETE", () => {
	let request = new Request();
	request.body = {
		email: "andrea.iossa",
		first_name: "andrea",
		last_name: "iossa"
	};
	let response = teachers_POST(request);
	let id = response.json.id;

	test("with bad param", () => {
		let request = new Request();
		request.params = { teacherID: "asd" };
		let response = teachers_teacherID_DELETE(request);
		expect(response.status).toBe(400);

	});

	test("with bad param", () => {
		let request = new Request();
		request.params = { teacherID: 0.5 };
		let response = teachers_teacherID_DELETE(request);
		expect(response.status).toBe(400);

	});

	test("with not existing teacherID", () => {
		let request = new Request();
		request.params = { teacherID: id + 5 };
		let response = teachers_teacherID_DELETE(request);
		expect(response.status).toBe(404);

	});

	test("with ok param", () => {
		let request = new Request();
		request.params = { teacherID: id };
		let response = teachers_teacherID_DELETE(request);
		expect(response.status).toBe(204);

	});

});
