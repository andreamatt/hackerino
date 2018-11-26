fetch = require('node-fetch');

const baseurl = process.env.BASEURL || 'http://localhost:3000';
const v = 'v1';

test("Checking GET /students", async () => {
	expect.assertions(1);
	let response = await fetch(`${baseurl}/${v}/students`);
	expect(response.status).toEqual(200);
});

test("Checking valid POST GET and DELETE on /students", async () => {
	expect.assertions(9);
	let student = { email: "andrea.matte@studenti.unitn.it", firstname: "andrea", lastname: "matte" };
	// testing POST
	let response = await fetch(`${baseurl}/${v}/students`, {
		method: 'POST',
		body: JSON.stringify(student),
		headers: {
			'Content-Type': 'application/json'
		}
	});
	let data = await response.text();
	let parsed = await JSON.parse(data);
	expect(parsed.email).toEqual(student.email);
	expect(parsed.firstname).toEqual(student.firstname);
	expect(parsed.lastname).toEqual(student.lastname);

	// testing GET of that student
	let response2 = await fetch(`${baseurl}/${v}/students/${parsed.id}`);
	let data2 = await response2.text();
	let parsed2 = await JSON.parse(data2);
	expect(parsed2.id).toEqual(parsed.id);
	expect(parsed2.email).toEqual(student.email);
	expect(parsed2.firstname).toEqual(student.firstname);
	expect(parsed2.lastname).toEqual(student.lastname);

	// testing GET by email
	let response3 = await fetch(`${baseurl}/${v}/students?email=${student.email}`);
	expect(response3.status).toEqual(200);

	// testing DELETE of that student
	let response4 = await fetch(`${baseurl}/${v}/students/${parsed2.id}`, {
		method: 'DELETE'
	});
	expect(response4.status).toEqual(204);
});

