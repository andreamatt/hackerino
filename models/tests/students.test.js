const students = require('../students');
const util = require('../utility');
const Request = util.Request;
const students_GET = students.students_GET;
const students_POST = students.students_POST;
const students_studentID_GET = students.students_studentID_GET;
const students_studentID_PUT = students.students_studentID_PUT;

beforeAll(() => {
	describe("/students GET empty", () => {
		test("With no query", () => {
			let request = new Request();
			let response = students_GET(request);
			expect(response.status).toBe(200);
			expect(response.json.tot_students).toBe(0);
			expect(response.json.students).toEqual([]);
		});
		test("With good limit and offset", () => {
			let request = new Request();
			request.query = { limit: 2, offset: 9 };
			let response = students_GET(request);
			expect(response.status).toBe(200);
			expect(response.json.tot_students).toBe(0);
			expect(response.json.students).toEqual([]);
		});
	});
});

describe("/students POST and GET", () => {
	test("Add twice and get it", () => {
		let request = new Request();
		request.body = { email: "a.b@c", first_name: "a", last_name: "b" };
		let response = students_POST(request);
		expect(response.status).toBe(201);
		expect(response.json).toMatchObject({
			email: "a.b@c",
			first_name: "a",
			last_name: "b"
		});

		response = students_POST(request);
		expect(response.status).toBe(423);
		expect(util.isString(response.text)).toBe(true);

		request = new Request();
		request.query = { email: "a.b@c" };
		response = students_GET(request);
		expect(response.status).toBe(200);
		expect(response.json).toMatchObject({
			tot_students: 1,
			students: [{
				email: "a.b@c",
				first_name: "a",
				last_name: "b"
			}]
		});

		request = new Request();
		request.query = { email: "a.b@c", limit: 1, offset: 0 };
		response = students_GET(request);
		expect(response.status).toBe(200);
		expect(response.json).toMatchObject({
			tot_students: 1,
			students: [{
				email: "a.b@c",
				first_name: "a",
				last_name: "b"
			}]
		});

		request = new Request();
		request.query = { email: "a.b@c", limit: 0 };
		response = students_GET(request);
		expect(response.status).toBe(200);
		expect(response.json).toEqual({
			tot_students: 1,
			students: []
		});

		request = new Request();
		request.query = { email: "a.b@c", offset: 1 };
		response = students_GET(request);
		expect(response.status).toBe(200);
		expect(response.json).toEqual({
			tot_students: 1,
			students: []
		});

		request = new Request();
		request.query = { email: "a.b@c", offset: -1 };
		response = students_GET(request);
		expect(response.status).toBe(400);
		expect(util.isString(response.text)).toBe(true);


		request = new Request();
		request.query = { email: "a.b@c", limit: -1 };
		response = students_GET(request);
		expect(response.status).toBe(400);
		expect(util.isString(response.text)).toBe(true);

	});
});

describe("students heavy POST and GET", () => {
	for (let i = 0; i < 100; i++) {
		let request = new Request();
		request.body = { email: i.toString(), first_name: "a", last_name: "b" };
		let response = students_POST(request);
		expect(response.status).toBe(201);

		expect(util.isStudent(response.json)).toBe(true);
	}

	let request = new Request();
	request.query = {};
	let response = students_GET(request);
	expect(response.status).toBe(200);

	expect(response.json.tot_students).toBe(response.json.students.length);
	let students = response.json.students;
	expect(students.every(stud => util.isStudent(stud))).toBe(true);

	request = new Request();
	request.query = { email: "1" };
	response = students_GET(request);
	expect(response.status).toBe(200);

	expect(response.json.tot_students).toBe(1);

	request = new Request();
	request.query = { limit: "1" };
	response = students_GET(request);
	expect(response.status).toBe(400);

	request = new Request();
	request.query = { limit: 20 };
	response = students_GET(request);
	expect(response.status).toBe(200);

	expect(response.json.tot_students >= 100).toBe(true);
	expect(response.json.students.length).toBe(20);

	request = new Request();
	request.query = { limit: 20, offset: 50 };
	response = students_GET(request);
	expect(response.status).toBe(200);

	expect(response.json.tot_students >= 100).toBe(true);
	expect(response.json.students.length).toBe(20);
	students = response.json.students;
	expect(students.every(stud => stud.id >= 50)).toBe(true);
});

describe("students GET with wrong parameters", () => {
	let request = new Request();
	request.query = { email: "" };
	let response = students_GET(request);
	expect(response.status).toBe(400);

	request = new Request();
	request.query = { email: 1 };
	response = students_GET(request);
	expect(response.status).toBe(400);

	request = new Request();
	request.query = { limit: -1 };
	response = students_GET(request);
	expect(response.status).toBe(400);

	request = new Request();
	request.query = { offset: -1 };
	response = students_GET(request);
	expect(response.status).toBe(400);

	request = new Request();
	request.query = { limit: "1" };
	response = students_GET(request);
	expect(response.status).toBe(400);

	request = new Request();
	request.query = { offset: {} };
	response = students_GET(request);
	expect(response.status).toBe(400);
});

describe("students POST with bad parameters", () => {
	let request = new Request();
	request.body = {
		email: 1,
		first_name: "a",
		last_name: "b"
	};
	let response = students_POST(request);
	expect(response.status).toBe(400);
	expect(util.isString(response.text)).toBe(true);


	request = new Request();
	request.body = {
		first_name: "a",
		last_name: "b"
	};
	response = students_POST(request);
	expect(response.status).toBe(400);
	expect(util.isString(response.text)).toBe(true);


	request = new Request();
	request.body = {
		email: "",
		first_name: "a",
		last_name: "b"
	};
	response = students_POST(request);
	expect(response.status).toBe(400);
	expect(util.isString(response.text)).toBe(true);


	request = new Request();
	request.body = {
		email: "asd",
		first_name: 1,
		last_name: "b"
	};
	response = students_POST(request);
	expect(response.status).toBe(400);
	expect(util.isString(response.text)).toBe(true);


	request = new Request();
	request.body = {
		email: "asd",
		first_name: "a",
		last_name: null
	};
	response = students_POST(request);
	expect(response.status).toBe(400);
	expect(util.isString(response.text)).toBe(true);

});

describe("students/studentID GET", () => {
	let request = new Request();
	request.body = {
		email: "andrea.matte",
		first_name: "andrea",
		last_name: "matte"
	};
	let response = students_POST(request);
	let id = response.json.id;
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
		let response = students.students_studentID_DELETE(request);
		expect(response.status).toBe(400);

	});

	test("with bad param", () => {
		let request = new Request();
		request.params = { studentID: 0.5 };
		let response = students.students_studentID_DELETE(request);
		expect(response.status).toBe(400);

	});

	test("with not existing studentID", () => {
		let request = new Request();
		request.params = { studentID: id + 5 };
		let response = students.students_studentID_DELETE(request);
		expect(response.status).toBe(404);

	});

	test("with ok param", () => {
		let request = new Request();
		request.params = { studentID: id };
		let response = students.students_studentID_DELETE(request);
		expect(response.status).toBe(204);

	});

});

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
});