const util = require('../../utility');
const Request = util.Request;
const students_studentID_PUT = require('../students_studentID_PUT');

const resetDB = require('../../sampleDB').resetDB;

beforeEach(resetDB);

describe("students/studentID PUT", () => {
	test("creating", () => {
		let request = new Request();
		request.params = { studentID: 99 };
		request.body = {
			email: "andrea.matte2@studenti.unitn.it",
			first_name: "f",
			last_name: "b"
		};
		let response = students_studentID_PUT(request);
		expect(response.status).toBe(201);
	});

	test("updating with good params", () => {
		let request = new Request();
		request.params = { studentID: 1 };
		request.body = {
			email: "andrea.matte@studenti.unitn.it",
			first_name: "asd",
			last_name: "mk"
		};
		let response = students_studentID_PUT(request);
		expect(response.status).toBe(200);
	});

	test("updating with bad params", () => {
		let request = new Request();
		request.params = { studentID: 1 };
		request.body = {
			email: "andrea.matte@studenti.unitn.it",
			first_name: 1,
			last_name: "mk"
		};
		let response = students_studentID_PUT(request);
		expect(response.status).toBe(400);
	});

	test("updating with bad params", () => {
		let request = new Request();
		request.params = { studentID: 1 };
		request.body = {
			email: "andrea.matte@studenti.unitn.it",
			first_name: "asd",
			last_name: null
		};
		let response = students_studentID_PUT(request);
		expect(response.status).toBe(400);
	});

	test("creating with existing email", () => {
		let request = new Request();
		request.params = { studentID: 99 };
		request.body = {
			email: "andrea.matte@studenti.unitn.it",
			first_name: "undefined",
			last_name: "null"
		};
		let response = students_studentID_PUT(request);
		expect(response.status).toBe(423);
	});

	test("creating with bad params", () => {
		let request = new Request();
		request.params = { studentID: 99 };
		request.body = {
			email: "andrea.matte@studenti.unitn.it",
			first_name: "asd",
			last_name: null
		};
		let response = students_studentID_PUT(request);
		expect(response.status).toBe(400);
	});

	test("creating with bad params", () => {
		let request = new Request();
		request.params = { studentID: 99 };
		request.body = {
			email: "andrea.matte@studenti.unitn.it",
			first_name: "asd",
			last_name: null
		};
		let response = students_studentID_PUT(request);
		expect(response.status).toBe(400);
	});

	test("creating with bad params", () => {
		let request = new Request();
		request.params = { studentID: 99 };
		request.body = {
			email: "",
			first_name: "asd",
			last_name: "be"
		};
		let response = students_studentID_PUT(request);
		expect(response.status).toBe(400);
	});

	test("put-update with wrong email", () => {
		let request = new Request();
		request.params = { studentID: 1 };
		request.body = {
			email: "andrea.maaaatte@studenti.unitn.it",
			first_name: "asd",
			last_name: "be"
		};
		response = students_studentID_PUT(request);
		expect(response.status).toBe(400);
	});
});
