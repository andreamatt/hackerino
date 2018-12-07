const util = require('../../utility');
const Request = util.Request;
const students_studentID_DELETE = require('../students_studentID_DELETE');
const students_POST = require('../students_POST');

describe("students/studentID DELETE", () => {
	let request = new Request();
	request.body = {
		email: "andrea.iossa",
		first_name: "andrea",
		last_name: "iossa"
	};
	let response = students_POST(request);
	let id = response.json.id;

	test("with bad param", () => {
		let request = new Request();
		request.params = { studentID: "asd" };
		let response = students_studentID_DELETE(request);
		expect(response.status).toBe(400);

	});

	test("with bad param", () => {
		let request = new Request();
		request.params = { studentID: 0.5 };
		let response = students_studentID_DELETE(request);
		expect(response.status).toBe(400);

	});

	test("with not existing studentID", () => {
		let request = new Request();
		request.params = { studentID: id + 5 };
		let response = students_studentID_DELETE(request);
		expect(response.status).toBe(404);

	});

	test("with ok param", () => {
		let request = new Request();
		request.params = { studentID: id };
		let response = students_studentID_DELETE(request);
		expect(response.status).toBe(204);

	});

});
