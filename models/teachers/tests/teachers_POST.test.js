const util = require('../../utility');
const Request = util.Request;
const teachers_GET = require('../teachers_GET');
const teachers_POST = require('../teachers_POST');
const resetDB = require('../../sampleDB').resetDB;

beforeEach(resetDB);

test("/teachers POST and GET", () => {
	let request = new Request();
	request.body = { email: "a.b@c", first_name: "a", last_name: "b" };
	let response = teachers_POST(request);
	expect(response.status).toBe(201);
	expect(response.json).toMatchObject({
		email: "a.b@c",
		first_name: "a",
		last_name: "b"
	});

	response = teachers_POST(request);
	expect(response.status).toBe(423);
	expect(util.isString(response.text)).toBe(true);

	request = new Request();
	request.query = { email: "a.b@c" };
	response = teachers_GET(request);
	expect(response.status).toBe(200);
	expect(response.json).toMatchObject({
		tot_teachers: 1,
		teachers: [{
			email: "a.b@c",
			first_name: "a",
			last_name: "b"
		}]
	});

	request = new Request();
	request.query = { email: "a.b@c", limit: 1, offset: 0 };
	response = teachers_GET(request);
	expect(response.status).toBe(200);
	expect(response.json).toMatchObject({
		tot_teachers: 1,
		teachers: [{
			email: "a.b@c",
			first_name: "a",
			last_name: "b"
		}]
	});

	request = new Request();
	request.query = { email: "a.b@c", limit: 0 };
	response = teachers_GET(request);
	expect(response.status).toBe(200);
	expect(response.json).toEqual({
		tot_teachers: 1,
		teachers: []
	});

	request = new Request();
	request.query = { email: "a.b@c", offset: 1 };
	response = teachers_GET(request);
	expect(response.status).toBe(200);
	expect(response.json).toEqual({
		tot_teachers: 1,
		teachers: []
	});

	request = new Request();
	request.query = { email: "a.b@c", offset: -1 };
	response = teachers_GET(request);
	expect(response.status).toBe(400);
	expect(util.isString(response.text)).toBe(true);

	request = new Request();
	request.query = { email: "a.b@c", limit: -1 };
	response = teachers_GET(request);
	expect(response.status).toBe(400);
	expect(util.isString(response.text)).toBe(true);
});

test("teachers heavy POST and GET", () => {
	for (let i = 0; i < 100; i++) {
		let request = new Request();
		request.body = { email: i.toString(), first_name: "a", last_name: "b" };
		let response = teachers_POST(request);
		expect(response.status).toBe(201);

		expect(util.isTeacher(response.json)).toBe(true);
	}

	let request = new Request();
	request.query = {};
	let response = teachers_GET(request);
	expect(response.status).toBe(200);

	expect(response.json.tot_teachers).toBe(response.json.teachers.length);
	let teachers = response.json.teachers;
	expect(teachers.every(stud => util.isTeacher(stud))).toBe(true);

	request = new Request();
	request.query = { email: "1" };
	response = teachers_GET(request);
	expect(response.status).toBe(200);

	expect(response.json.tot_teachers).toBe(1);

	request = new Request();
	request.query = { limit: "1" };
	response = teachers_GET(request);
	expect(response.status).toBe(200);

	request = new Request();
	request.query = { limit: 20 };
	response = teachers_GET(request);
	expect(response.status).toBe(200);

	expect(response.json.tot_teachers >= 100).toBe(true);
	expect(response.json.teachers.length).toBe(20);

	request = new Request();
	request.query = { limit: 20, offset: 50 };
	response = teachers_GET(request);
	expect(response.status).toBe(200);

	expect(response.json.tot_teachers >= 100).toBe(true);
	expect(response.json.teachers.length).toBe(20);
	teachers = response.json.teachers;
	expect(teachers.every(stud => stud.id >= 50)).toBe(true);
});

test("teachers POST with bad parameters", () => {
	let request = new Request();
	request.body = {
		email: 1,
		first_name: "a",
		last_name: "b"
	};
	let response = teachers_POST(request);
	expect(response.status).toBe(400);
	expect(util.isString(response.text)).toBe(true);


	request = new Request();
	request.body = {
		first_name: "a",
		last_name: "b"
	};
	response = teachers_POST(request);
	expect(response.status).toBe(400);
	expect(util.isString(response.text)).toBe(true);


	request = new Request();
	request.body = {
		email: "",
		first_name: "a",
		last_name: "b"
	};
	response = teachers_POST(request);
	expect(response.status).toBe(400);
	expect(util.isString(response.text)).toBe(true);


	request = new Request();
	request.body = {
		email: "asd",
		first_name: 1,
		last_name: "b"
	};
	response = teachers_POST(request);
	expect(response.status).toBe(400);
	expect(util.isString(response.text)).toBe(true);


	request = new Request();
	request.body = {
		email: "asd",
		first_name: "a",
		last_name: null
	};
	response = teachers_POST(request);
	expect(response.status).toBe(400);
	expect(util.isString(response.text)).toBe(true);

});

test("teacher POST already used email", () => {
	let request = new Request();
	request.body = {
		email: "fabio.casati@unitn.it",
		first_name: "a",
		last_name: "b"
	};
	let response = teachers_POST(request);
	expect(response.status).toBe(423);
	expect(util.isString(response.text)).toBe(true);
});