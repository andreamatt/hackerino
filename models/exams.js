const util = require('./utility');
//const submissions = require('./submissions');
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
			return new Response(400, "Offset is not an integer");
		}
		if (offset < 0) {
			return new Response(400, "Offset is negative");
		}
		result = doOffset(result, offset);
	}
	let limit = req.query.limit;
	if (limit !== undefined) {
		limit = toInt(limit);
		if (!isInteger(limit)) {
			return new Response(400, "Limit is not an integer");
		}
		if (limit < 0) {
			return new Response(400, "Limit is negative");
		}
		result = doLimit(result, limit);
	}
	return new Response(200, { tot_exams: tot, exams: result });
}

function exams_POST(req) {
	let date = req.body.date;
	let deadline = req.body.deadline;
	let review_deadline = req.body.review_deadline;
	let exam = createExam(null, date, deadline, review_deadline);
	if (isString(exam)) { // if exam is an error msg
		return new Response(400, exam);
	}
	exams_list[exam.id] = exam;
	exams_students[exam.id] = [];
	exams_teachers[exam.id] = [];
	exams_tasks[exam.id] = [];
	return new Response(201, exam);
}

function exams_examID_GET(req) {
	let id = toInt(req.params.examID);
	if (!isInteger(id) || id < 1) {
		return new Response(404, "Bad id parameter");
	}
	if (!exams_list[id]) {
		return new Response(404, "Exam not found");
	}
	return new Response(200, exams_list[id]);
}

function exams_examID_PUT(req) {
	let id = toInt(req.params.examID);
	if (!isInteger(id) || id < 1) {
		return new Response(404, "Bad id parameter");
	}
	if (exams_list[id]) {
		let updated = createExam(id, req.body.date, req.body.deadline, req.body.review_deadline);
		if (isString(updated)) { // there is an error msg
			return new Response(400, updated);
		}
		exams_list[exam.id] = updated;
		return new Response(200, updated);
	} else {
		let created = createExam(id, req.body.date, req.body.deadline, req.body.review_deadline);
		if (isString(updated)) { // there is an error msg
			return new Response(400, updated);
		}
		exams_list[exam.id] = created;
		return new Response(201, created);
	}
}

function exams_examID_DELETE(req) {
	let id = toInt(req.params.examID);
	if (!isInteger(id) || id < 1) {
		return new Response(404, "Bad id parameter");
	}
	if (!exams_list[id]) {
		return new Response(404, "Exam not found");
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

	return new Response(204, "Deleted");
}

function exams_examID_students_GET(req) {
	let id = toInt(req.params.examID);
	if (!isInteger(id) || id < 1) {
		return new Response(404, "Bad id parameter");
	}
	if (!exams_list[id]) {
		return new Response(404, "Exam not found");
	}

	let result = exams_students[id];
	let tot = result.length;
	let offset = req.query.offset;
	if (offset !== undefined) {
		offset = toInt(offset);
		if (!isInteger(offset)) {
			return new Response(400, "Offset is not an integer");
		}
		if (offset < 0) {
			return new Response(400, "Offset is negative");
		}
		result = doOffset(result, offset);
	}
	let limit = req.query.limit;
	if (limit !== undefined) {
		limit = toInt(limit);
		if (!isInteger(limit)) {
			return new Response(400, "Limit is not an integer");
		}
		if (limit < 0) {
			return new Response(400, "Limit is negative");
		}
		result = doLimit(result, limit);
	}
	result = result.map(studID => {
		let r = new Request();
		r.params.studentID = studID;
		return students.students_GET(r);
	});
	return new Response(200, { tot_students: tot, students: result });
}

function exams_examID_students_POST(req) {
	let id = toInt(req.params.examID);
	if (!isInteger(id) || id < 1) {
		return new Response(404, "Bad id parameter");
	}
	if (!exams_list[id]) {
		return new Response(404, "Exam not found");
	}

	let studentID = req.body.studentID;
	if (!isInteger(studentID) || studentID < 1) {
		return new Response(400, "Bad studentID parameter");
	}
	if (exams_students[id].includes(studentID)) {
		return new Response(423, "Student already signed up");
	}
	let stud_req = new Request();
	stud_req.params.studentID = studentID;
	let stud_res = students.students_studentID_GET(stud_req);
	if (stud_res.status !== 200) {
		return new Response(424, "Student not found therefore not added");
	} else {
		exams_students[id].push(studentID);
		return new Response(204, "Student added to exam");
	}
}

function exams_examID_teachers_GET(req) {
	let id = toInt(req.params.examID);
	if (!isInteger(id) || id < 1) {
		return new Response(404, "Bad id parameter");
	}
	if (!exams_list[id]) {
		return new Response(404, "Exam not found");
	}

	let result = exams_teachers[id];
	let tot = result.length;
	let offset = req.query.offset;
	if (offset !== undefined) {
		offset = toInt(offset);
		if (!isInteger(offset)) {
			return new Response(400, "Offset is not an integer");
		}
		if (offset < 0) {
			return new Response(400, "Offset is negative");
		}
		result = doOffset(result, offset);
	}
	let limit = req.query.limit;
	if (limit !== undefined) {
		limit = toInt(limit);
		if (!isInteger(limit)) {
			return new Response(400, "Limit is not an integer");
		}
		if (limit < 0) {
			return new Response(400, "Limit is negative");
		}
		result = doLimit(result, limit);
	}
	result = result.map(teacherID => {
		let r = new Request();
		r.params.teacherID = teacherID;
		return teachers.teachers_GET(r);
	});
	return new Response(200, { tot_teachers: tot, teachers: result });
}

function exams_examID_teachers_POST(req) {
	let id = toInt(req.params.examID);
	if (!isInteger(id) || id < 1) {
		return new Response(404, "Bad id parameter");
	}
	if (!exams_list[id]) {
		return new Response(404, "Exam not found");
	}

	let teacherID = req.body.teacherID;
	if (!isInteger(teacherID) || teacherID < 1) {
		return new Response(400, "Bad teacherID parameter");
	}
	if (exams_teachers[id].includes(teacherID)) {
		return new Response(423, "Teacher already signed up");
	}
	let stud_req = new Request();
	stud_req.params.teacherID = teacherID;
	let stud_res = teachers.teachers_teacherID_GET(stud_req);
	if (stud_res.status !== 200) {
		return new Response(424, "Teacher not found therefore not added");
	} else {
		exams_teachers[id].push(teacherID);
		return new Response(204, "Teacher added to exam");
	}
}

function exams_examID_tasks_GET(req) {
	let id = toInt(req.params.examID);
	if (!isInteger(id) || id < 1) {
		return new Response(404, "Bad id parameter");
	}
	if (!exams_list[id]) {
		return new Response(404, "Exam not found");
	}

	let result = exams_tasks[id];
	let tot = result.length;
	let offset = req.query.offset;
	if (offset !== undefined) {
		offset = toInt(offset);
		if (!isInteger(offset)) {
			return new Response(400, "Offset is not an integer");
		}
		if (offset < 0) {
			return new Response(400, "Offset is negative");
		}
		result = doOffset(result, offset);
	}
	let limit = req.query.limit;
	if (limit !== undefined) {
		limit = toInt(limit);
		if (!isInteger(limit)) {
			return new Response(400, "Limit is not an integer");
		}
		if (limit < 0) {
			return new Response(400, "Limit is negative");
		}
		result = doLimit(result, limit);
	}
	result = result.map(taskID => {
		let r = new Request();
		r.params.taskID = taskID;
		return tasks.tasks_GET(r);
	});
	return new Response(200, { tot_tasks: tot, tasks: result });
}

function exams_examID_tasks_POST(req) {
	let id = toInt(req.params.examID);
	if (!isInteger(id) || id < 1) {
		return new Response(404, "Bad id parameter");
	}
	if (!exams_list[id]) {
		return new Response(404, "Exam not found");
	}

	let taskID = req.body.taskID;
	if (!isInteger(taskID) || taskID < 1) {
		return new Response(400, "Bad taskID parameter");
	}
	if (exams_tasks[id].includes(taskID)) {
		return new Response(423, "Task already signed up");
	}
	let stud_req = new Request();
	stud_req.params.taskID = taskID;
	let stud_res = tasks.tasks_taskID_GET(stud_req);
	if (stud_res.status !== 200) {
		return new Response(424, "Task not found therefore not added");
	} else {
		exams_tasks[id].push(taskID);
		return new Response(204, "Task added to exam");
	}
}

function exams_examID_submissions_GET(req) {
	let id = toInt(req.params.examID);
	if (!isInteger(id) || id < 1) {
		return new Response(404, "Bad id parameter");
	}
	if (!exams_list[id]) {
		return new Response(404, "Exam not found");
	}

	let sub_req = new Request();
	let result = submissions.submissions_GET(sub_req).submissions;
	result = result.filter(sub => sub.examID === id);

	let tot = result.length;
	let offset = req.query.offset;
	if (offset !== undefined) {
		offset = toInt(offset);
		if (!isInteger(offset)) {
			return new Response(400, "Offset is not an integer");
		}
		if (offset < 0) {
			return new Response(400, "Offset is negative");
		}
		result = doOffset(result, offset);
	}
	let limit = req.query.limit;
	if (limit !== undefined) {
		limit = toInt(limit);
		if (!isInteger(limit)) {
			return new Response(400, "Limit is not an integer");
		}
		if (limit < 0) {
			return new Response(400, "Limit is negative");
		}
		result = doLimit(result, limit);
	}
	return new Response(200, { tot_submissions: tot, submissions: result });
}

module.exports = {
	exams_GET,
	exams_POST,
	exams_examID_GET,
	exams_examID_PUT,
	exams_examID_DELETE,
	exams_examID_students_GET,
	exams_examID_students_POST,
	exams_examID_teachers_GET,
	exams_examID_teachers_POST,
	exams_examID_tasks_GET,
	exams_examID_tasks_POST,
	exams_examID_submissions_GET
};