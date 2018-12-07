const teachers_list = require('./teachers').teachers_list;
const Teacher = require('./teachers').Teacher;
const util = require('../utility');
const Response = util.Response;
const isString = util.isString;
const isInteger = util.isInteger;

function teachers_teacherID_PUT(req) {
	let id = util.toInt(req.params.teacherID);
	let email = req.body.email;
	let first_name = req.body.first_name;
	let last_name = req.body.last_name;

	if (!isInteger(id)) return new Response(400, "Bad id path parameter");
	if (!isString(email)) return new Response(400, "Bad email body parameter");
	if (!isString(first_name)) return new Response(400, "Bad first_name body parameter");
	if (!isString(last_name)) return new Response(400, "Bad last_name body parameter");

	if (teachers_list[id]) {
		if (teachers_list[id].email !== email) {
			return new Response(400, `Passed email (${email}) is different from teacher ${id}'s email(${teachers_list[id].email})`);
		}
		teachers_list[id].first_name = first_name;
		teachers_list[id].last_name = last_name;
		return new Response(200, "Teacher updated");
	} else {
		let withEmail = Object.values(teachers_list).filter(stud => stud.email === email);
		if (withEmail.length > 0) {
			return new Response(423, "A teacher with such email already exists");
		}
		let teacher = new Teacher(email, first_name, last_name);
		teacher.id = id;
		teachers_list[id] = teacher;
		return new Response(201, "Teacher created");
	}
}

module.exports = teachers_teacherID_PUT;