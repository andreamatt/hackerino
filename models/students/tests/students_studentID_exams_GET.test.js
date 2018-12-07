const students_POST = require('../students_POST');
const exams_POST = require('../../exams/exams_POST');
const exams_examID_students_POST = require('../../exams/exams_examID_students_POST');
const students_studentID_exams_GET = require('../students_studentID_exams_GET');
const util = require('../utility');
const Request = util.Request;

describe("students_studentID_exams_GET", () => {
	// add a student
	let request = new Request();
	request.body = {
		email: "students_studentID_exams_GET_test",
		first_name: "a",
		last_name: "b"
	};
	let response = students_POST(request);
	expect(response.status).toBe(201);
	let student_id = response.json.id;

	// add an exam
	request = new Request();
	request.body = {
		date: "2018-12-07T14:55:13.649Z",
		deadline: "2019-12-07T14:55:13.649Z",
		review_deadline: "2020-12-07T14:55:13.649Z"
	};
	response = students_POST(request);
	expect(response.status).toBe(201);
	let exam_id = response.json.id;

	// add student to exam
	request = new Request();
	request.params.examID = exam_id;
	request.body.studentID = student_id;
	response = exams_examID_students_POST(request);
	expect(response.status).toBe(204);

	// get exams
	request = new Request();
	request.params.studentID = student_id;
	response = students_studentID_exams_GET(request);
	expect(response.status).toBe(200);
	expect(util.isExam(response.json.exams[0])).toBe(true);
	expect(response.json.exams[0].id).toBe(exam_id);

	request = new Request();
	request.params.studentID = student_id;
	request.query = { offset: 0, limit: 1 };
	response = students_studentID_exams_GET(request);
	expect(response.status).toBe(200);
	expect(util.isExam(response.json.exams[0])).toBe(true);
	expect(response.json.exams[0].id).toBe(exam_id);

	request = new Request();
	request.params.studentID = student_id;
	request.query = { offset: -1 };
	response = students_studentID_exams_GET(request);
	expect(response.status).toBe(400);

	request = new Request();
	request.params.studentID = student_id;
	request.query = { offset: "a" };
	response = students_studentID_exams_GET(request);
	expect(response.status).toBe(400);

	request = new Request();
	request.params.studentID = student_id;
	request.query = { limit: -1 };
	response = students_studentID_exams_GET(request);
	expect(response.status).toBe(400);

	request = new Request();
	request.params.studentID = student_id;
	request.query = { limit: "a" };
	response = students_studentID_exams_GET(request);
	expect(response.status).toBe(400);
});