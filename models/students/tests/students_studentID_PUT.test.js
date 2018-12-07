const util = require('../../utility');
const Request = util.Request;
const students_studentID_PUT = require('../students_studentID_PUT');

describe("students/studentID PUT", () => {
	let request = new Request();
	let id = 83721897;
	request.params = { studentID: id };
	request.body = {
		email: "andrea.matte2",
		first_name: "andrea",
		last_name: "matte"
	};
	let response = students_studentID_PUT(request);
	expect(response.status).toBe(201);

	test("updating with good params", () => {
		let request = new Request();
		request.params = { studentID: id };
		request.body = {
			email: "andrea.matte2",
			first_name: "asd",
			last_name: "mk"
		};
		let response = students_studentID_PUT(request);
		expect(response.status).toBe(200);
	});

	test("updating with bad params", () => {
		let request = new Request();
		request.params = { studentID: id };
		request.body = {
			email: "andrea.matte2",
			first_name: 1,
			last_name: "mk"
		};
		let response = students_studentID_PUT(request);
		expect(response.status).toBe(400);
	});

	test("updating with bad params", () => {
		let request = new Request();
		request.params = { studentID: id };
		request.body = {
			email: "andrea.matte2",
			first_name: "asd",
			last_name: null
		};
		let response = students_studentID_PUT(request);
		expect(response.status).toBe(400);
	});

	test("creating with existing email", () => {
		let request = new Request();
		request.params = { studentID: id + 2 };
		request.body = {
			email: "andrea.matte",
			first_name: "undefined",
			last_name: "null"
		};
		let response = students_studentID_PUT(request);
		expect(response.status).toBe(201);

		request.params = { studentID: id + 8392 };
		response = students_studentID_PUT(request);
		expect(response.status).toBe(423);
	});

	test("creating with bad params", () => {
		let request = new Request();
		request.params = { studentID: id + 4 };
		request.body = {
			email: "andrea.matte9",
			first_name: "asd",
			last_name: null
		};
		let response = students_studentID_PUT(request);
		expect(response.status).toBe(400);
	});

	test("creating with bad params", () => {
		let request = new Request();
		request.params = { studentID: 9.2 };
		request.body = {
			email: "andrea.matte9",
			first_name: "asd",
			last_name: null
		};
		let response = students_studentID_PUT(request);
		expect(response.status).toBe(400);
	});

	test("creating with bad params", () => {
		let request = new Request();
		request.params = { studentID: id + 100 };
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
		request.params = { studentID: id + 92110 };
		request.body = {
			email: "90890ddsaio",
			first_name: "asd",
			last_name: "be"
		};
		let response = students_studentID_PUT(request);
		expect(response.status).toBe(201);

		request.body.email = "wrong";
		response = students_studentID_PUT(request);
		expect(response.status).toBe(400);
	});
});
