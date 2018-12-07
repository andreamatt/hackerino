const teachers_list = require('./teachers').teachers_list;
const Teacher = require('./teachers').Teacher;
const util = require('../utility');
const Response = util.Response;
const isString = util.isString;

function teachers_POST(req) {
	let email = req.body.email;
	let first_name = req.body.first_name;
	let last_name = req.body.last_name;
	if (!isString(email)) return new Response(400, "Bad email body parameter");
	if (!isString(first_name)) return new Response(400, "Bad first_name body parameter");
	if (!isString(last_name)) return new Response(400, "Bad last_name body parameter");

	let byEmail = Object.values(teachers_list).filter(stud => stud.email === email);
	if (byEmail.length > 0) {
		return new Response(423, "A teacher with such email already exists");
	}

	let stud = new Teacher(email, first_name, last_name);
	teachers_list[stud.id] = stud;
	return new Response(201, stud);
}

module.exports = teachers_POST;