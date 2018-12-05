const util = require('./utility');
const submissions = require('./submissions');
const students = require('./students');
const isExam = util.isExam;
const toInt = util.toInt;
const isInteger = util.isInteger;
const isString = util.isString;
const Response = util.Response;
const doOffset = util.doOffset;
const doLimit = util.doLimit;

///////////////////////////////////////////

const exams_list = {
	/*
	1: {
		id: 1,
		date: "December 17, 1995 03:24:00",
		deadline: "December 17, 1995 03:24:00",
		review_deadline: "December 17, 1995 03:24:00",
		tot_students: 1,
		tot_teachers: 1,
		tot_tasks: 1
	}
	*/
};
const exams_students = {
	/*
	1: [2, 98, 15],
	3: [5, 63, 15]
	*/
};
const exams_teachers = {
	/*
	1: [2, 98, 15],
	3: [5, 63, 15]
	*/
};
const exams_tasks = {
	/*
	1: [2, 98, 15],
	3: [5, 63, 15]
	*/
};

function Exam(date, deadline, review_deadline) {
	this.id = 1;
	while (exams_list[this.id]) {
		this.id++;
	}
	this.date = date;
	this.deadline = deadline;
	this.review_deadline = review_deadline;
	this.tot_students = 0;
	this.tot_teachers = 0;
	this.tot_tasks = 0;
}

function createExam(id, date, deadline, review_deadline) {
	let exam = new Exam(date, deadline, review_deadline);
	if (id !== undefined && id !== null) {
		exam.id = id;
	}
	let msg = isExam(exam);
	if (msg !== "ok") {
		return msg;
	}

	return exam;
}

function exams_GET(req) {
	let result = Object.values(exams_list);
	let tot = result.length;
	let offset = req.query.offset;
	if (offset !== undefined) {
		offset = toInt(offset);
		if (!isInteger(offset)) {
			return new Response(400, "Offset is not an integer", null);
		}
		if (offset < 0) {
			return new Response(400, "Offset is negative", null);
		}
		result = doOffset(result, offset);
	}
	let limit = req.query.limit;
	if (limit !== undefined) {
		limit = toInt(limit);
		if (!isInteger(limit)) {
			return new Response(400, "Limit is not an integer", null);
		}
		if (limit < 0) {
			return new Response(400, "Limit is negative", null);
		}
		result = doLimit(result, limit);
	}
	return new Response(200, null, { tot_exams: tot, exams: result });
}

function exams_POST(req) {
	let date = req.body.date;
	let deadline = req.body.deadline;
	let review_deadline = req.body.review_deadline;
	let exam = createExam(null, date, deadline, review_deadline);
	if (isString(exam)) { // if exam is an error msg
		return new Response(400, exam, null);
	}
	exams_list[exam.id] = exam;
	exams_students[exam.id] = [];
	exams_teachers[exam.id] = [];
	exams_tasks[exam.id] = [];
	return new Response(201, null, exam);
}

function exams_examID_GET(req) {
	let id = toInt(req.params.examID);
	if (!isInteger(id) || id < 1) {
		return new Response(404, "Bad id parameter", null);
	}
	if (!exams_list[id]) {
		return new Response(404, "Exam not found", null);
	}
	return new Response(200, null, exams_list[id]);
}

function exams_examID_PUT(req) {
	let id = toInt(req.params.examID);
	if (!isInteger(id) || id < 1) {
		return new Response(404, "Bad id parameter", null);
	}
	if (exams_list[id]) {
		let updated = createExam(id, req.body.date, req.body.deadline, req.body.review_deadline);
		if (isString(updated)) { // there is an error msg
			return new Response(400, updated, null);
		}
		exams_list[exam.id] = updated;
		return new Response(200, null, updated);
	} else {
		let created = createExam(id, req.body.date, req.body.deadline, req.body.review_deadline);
		if (isString(updated)) { // there is an error msg
			return new Response(400, updated, null);
		}
		exams_list[exam.id] = created;
		return new Response(201, null, created);
	}
}

function exams_examID_DELETE(req) {
	let id = toInt(req.params.examID);
	if (!isInteger(id) || id < 1) {
		return new Response(404, "Bad id parameter", null);
	}
	if (!exams_list[id]) {
		return new Response(404, "Exam not found", null);
	}
	// delete exam
	delete exams_list[id];
	delete exams_students[id];
	delete exams_teachers[id];
	delete exams_tasks[id];

	// delete submissions
	let sub_req = new Request();
	sub_req.params.examID = id;
	let filtered_subs = exams_examID_submissions_GET(sub_req).submissions;
	for (sub of filtered_subs) {
		let req = new Request();
		req.params.submissionID = sub.id;
		submissions.submissions_submissionID_DELETE(req);
	}

	return new Response(204, "Deleted", null);
}

function exams_examID_students_GET(req) {
	let id = toInt(req.params.examID);
	if (!isInteger(id) || id < 1) {
		return new Response(404, "Bad id parameter", null);
	}
	if (!exams_list[id]) {
		return new Response(404, "Exam not found", null);
	}

	let result = exams_students[id];
	let tot = result.length;
	let offset = req.query.offset;
	if (offset !== undefined) {
		offset = toInt(offset);
		if (!isInteger(offset)) {
			return new Response(400, "Offset is not an integer", null);
		}
		if (offset < 0) {
			return new Response(400, "Offset is negative", null);
		}
		result = doOffset(result, offset);
	}
	let limit = req.query.limit;
	if (limit !== undefined) {
		limit = toInt(limit);
		if (!isInteger(limit)) {
			return new Response(400, "Limit is not an integer", null);
		}
		if (limit < 0) {
			return new Response(400, "Limit is negative", null);
		}
		result = doLimit(result, limit);
	}
	result = result.map(studID => {
		let r = new Request();
		r.params.studentID = studID;
		return students.students_GET(r);
	});
	return new Response(200, null, { tot_students: tot, students: result });
}

function exams_examID_teachers_GET(req) {
	let id = toInt(req.params.examID);
	if (!isInteger(id) || id < 1) {
		return new Response(404, "Bad id parameter", null);
	}
	if (!exams_list[id]) {
		return new Response(404, "Exam not found", null);
	}

	let result = exams_teachers[id];
	let tot = result.length;
	let offset = req.query.offset;
	if (offset !== undefined) {
		offset = toInt(offset);
		if (!isInteger(offset)) {
			return new Response(400, "Offset is not an integer", null);
		}
		if (offset < 0) {
			return new Response(400, "Offset is negative", null);
		}
		result = doOffset(result, offset);
	}
	let limit = req.query.limit;
	if (limit !== undefined) {
		limit = toInt(limit);
		if (!isInteger(limit)) {
			return new Response(400, "Limit is not an integer", null);
		}
		if (limit < 0) {
			return new Response(400, "Limit is negative", null);
		}
		result = doLimit(result, limit);
	}
	result = result.map(teacherID => {
		let r = new Request();
		r.params.teacherID = teacherID;
		return teachers.teachers_GET(r);
	});
	return new Response(200, null, { tot_teachers: tot, teachers: result });
}

module.exports = {
	exams_GET,
	exams_POST,
	exams_examID_GET,
	exams_examID_PUT,
	exams_examID_DELETE,
	exams_examID_students_GET,
	exams_examID_teachers_GET
};