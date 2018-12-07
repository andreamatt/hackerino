const teachers_POST = require('../teachers_POST');
const exams_POST = require('../../exams/exams_POST');
const exams_examID_teachers_POST = require('../../exams/exams_examID_teachers_POST');
const teachers_teacherID_exams_GET = require('../teachers_teacherID_exams_GET');
const util = require('../utility');
const Request = util.Request;

describe("teachers_teacherID_exams_GET", () => {
	// add a teacher
	let request = new Request();
	request.body = {
		email: "teachers_teacherID_exams_GET_test",
		first_name: "a",
		last_name: "b"
	};
	let response = teachers_POST(request);
	expect(response.status).toBe(201);
	let teacher_id = response.json.id;

	// add an exam
	request = new Request();
	request.body = {
		date: "2018-12-07T14:55:13.649Z",
		deadline: "2019-12-07T14:55:13.649Z",
		review_deadline: "2020-12-07T14:55:13.649Z"
	};
	response = teachers_POST(request);
	expect(response.status).toBe(201);
	let exam_id = response.json.id;

	// add teacher to exam
	request = new Request();
	request.params.examID = exam_id;
	request.body.teacherID = teacher_id;
	response = exams_examID_teachers_POST(request);
	expect(response.status).toBe(204);

	// get exams
	request = new Request();
	request.params.teacherID = teacher_id;
	response = teachers_teacherID_exams_GET(request);
	expect(response.status).toBe(200);
	expect(util.isExam(response.json.exams[0])).toBe(true);
	expect(response.json.exams[0].id).toBe(exam_id);

	request = new Request();
	request.params.teacherID = teacher_id;
	request.query = { offset: 0, limit: 1 };
	response = teachers_teacherID_exams_GET(request);
	expect(response.status).toBe(200);
	expect(util.isExam(response.json.exams[0])).toBe(true);
	expect(response.json.exams[0].id).toBe(exam_id);

	request = new Request();
	request.params.teacherID = teacher_id;
	request.query = { offset: -1 };
	response = teachers_teacherID_exams_GET(request);
	expect(response.status).toBe(400);

	request = new Request();
	request.params.teacherID = teacher_id;
	request.query = { offset: "a" };
	response = teachers_teacherID_exams_GET(request);
	expect(response.status).toBe(400);

	request = new Request();
	request.params.teacherID = teacher_id;
	request.query = { limit: -1 };
	response = teachers_teacherID_exams_GET(request);
	expect(response.status).toBe(400);

	request = new Request();
	request.params.teacherID = teacher_id;
	request.query = { limit: "a" };
	response = teachers_teacherID_exams_GET(request);
	expect(response.status).toBe(400);
});