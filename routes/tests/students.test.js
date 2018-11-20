const app = require('../../app'),
	fetch = require('node-fetch');

const basepath = 'http://localhost:3000/v1';

test("Checking GET /students", async () => {
	expect.assertions(2);
	let response = await fetch(`${basepath}/students`);
	let data = await response.text();
	let parsed = await JSON.parse(data);
	expect(parsed.tot_students).toEqual(2);
	expect(parsed.students.length).toEqual(2);
});

test("Checking GET /students/1", async () => {
	expect.assertions(1);
	let response = await fetch(`${basepath}/students/1`);
	let data = await response.text();
	let parsed = await JSON.parse(data);
	expect(JSON.stringify(parsed)).toEqual(JSON.stringify({
		id: 1,
		email: "mario@rossi.it",
		firstname: "mario",
		lastname: "rossi"
	}));
});

test("Testing GET /students?email=mario@rossi.it", async () => {
	expect.assertions(1);
	let response = await fetch(`${basepath}/students/1`);
	let data = await response.text();
	let parsed = await JSON.parse(data);
	expect(JSON.stringify(parsed)).toEqual(JSON.stringify({
		id: 1,
		email: "mario@rossi.it",
		firstname: "mario",
		lastname: "rossi"
	}));
});