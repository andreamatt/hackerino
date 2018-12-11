const util = require('../../utility');
const Request = util.Request;
const students_GET = require('../students_GET');
const students_POST = require('../students_POST');
const resetDB = require('../../sampleDB').resetDB;

beforeEach(resetDB);

test("/students POST and GET", () => {
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
	request.query = { email: "a.b@c", limit: "1", offset: "0" };
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
	request.query = { email: "a.b@c", limit: "0" };
	response = students_GET(request);
	expect(response.status).toBe(200);
	expect(response.json).toEqual({
		tot_students: 1,
		students: []
	});

	request = new Request();
	request.query = { email: "a.b@c", offset: "1" };
	response = students_GET(request);
	expect(response.status).toBe(200);
	expect(response.json).toEqual({
		tot_students: 1,
		students: []
	});

	request = new Request();
	request.query = { email: "a.b@c", offset: "-1" };
	response = students_GET(request);
	expect(response.status).toBe(400);
	expect(util.isString(response.text)).toBe(true);

	request = new Request();
	request.query = { email: "a.b@c", limit: -1 };
	response = students_GET(request);
	expect(response.status).toBe(400);
	expect(util.isString(response.text)).toBe(true);
});

test("students heavy POST and GET", () => {
	for (let i = 0; i < 100; i++) {
		let request = new Request();
		request.body = { email: i.toString(), first_name: "a", last_name: "b" };
		let response = students_POST(request);
		expect(response.status).toBe(201);

		expect(util.isTeacher(response.json)).toBe(true);
	}

	let request = new Request();
	request.query = {};
	let response = students_GET(request);
	expect(response.status).toBe(200);

	expect(response.json.tot_students).toBe(response.json.students.length);
	let students = response.json.students;
	expect(students.every(stud => util.isTeacher(stud))).toBe(true);

	request = new Request();
	request.query = { email: "1" };
	response = students_GET(request);
	expect(response.status).toBe(200);

	expect(response.json.tot_students).toBe(1);

	request = new Request();
	request.query = { limit: "1" };
	response = students_GET(request);
	expect(response.status).toBe(200);

	request = new Request();
	request.query = { limit: "20" };
	response = students_GET(request);
	expect(response.status).toBe(200);

	expect(response.json.tot_students >= 100).toBe(true);
	expect(response.json.students.length).toBe(20);

	request = new Request();
	request.query = { limit: "20", offset: "50" };
	response = students_GET(request);
	expect(response.status).toBe(200);

	expect(response.json.tot_students >= 100).toBe(true);
	expect(response.json.students.length).toBe(20);
	students = response.json.students;
	expect(students.every(stud => stud.id >= 50)).toBe(true);
});

test("students POST with bad parameters", () => {
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

test("student POST already used email", () => {
	let request = new Request();
	request.body = {
		email: "andrea.matte@studenti.unitn.it",
		first_name: "a",
		last_name: "b"
	};
	let response = students_POST(request);
	expect(response.status).toBe(423);
	expect(util.isString(response.text)).toBe(true);
});