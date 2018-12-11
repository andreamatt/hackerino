const teachers_teacherID_exams_GET = require('../teachers_teacherID_exams_GET');
const exams_examID_teachers_GET = require('../../exams/exams_examID_teachers_GET');
const util = require('../../utility');
const Request = util.Request;
const resetDB = require('../../sampleDB').resetDB;

beforeEach(resetDB);

test("teachers_teacherID_exams_GET", () => {
	// let teacher_id = 1;
	// let exam_id = 3;

	// get exam's teachers
	request = new Request();
	request.params.examID = "3";
	response = exams_examID_teachers_GET(request);
	expect(response.status).toBe(200);
	let teachers = response.json.teachers;
	expect(teachers.filter(t => t.id === 1).length).toBe(1);
	expect(teachers.length > 0).toBe(true);
	expect(util.isTeacher(teachers[0])).toBe(true);
	expect(teachers.map(t => t.id).includes(1)).toBe(true);

	// get exams
	request = new Request();
	request.params.teacherID = "1";
	response = teachers_teacherID_exams_GET(request);
	expect(response.status).toBe(200);
	let exams = response.json.exams;
	expect(exams.length > 0).toBe(true);
	expect(util.isExam(exams[0])).toBe(true);
	expect(exams.map(e => e.id)).toEqual([3, 4]);

	request = new Request();
	request.params.teacherID = "1";
	request.query = { offset: "1", limit: "1" };
	response = teachers_teacherID_exams_GET(request);
	expect(response.status).toBe(200);
	exams = response.json.exams;
	expect(exams.length > 0).toBe(true);
	expect(util.isExam(exams[0])).toBe(true);
	expect(exams.map(e => e.id)).toEqual([4]);

	request = new Request();
	request.params.teacherID = "1";
	request.query = { offset: "-1" };
	response = teachers_teacherID_exams_GET(request);
	expect(response.status).toBe(400);

	request = new Request();
	request.params.teacherID = "1";
	request.query = { offset: "a" };
	response = teachers_teacherID_exams_GET(request);
	expect(response.status).toBe(400);

	request = new Request();
	request.params.teacherID = "1";
	request.query = { limit: "-1" };
	response = teachers_teacherID_exams_GET(request);
	expect(response.status).toBe(400);

	request = new Request();
	request.params.teacherID = "1";
	request.query = { limit: "a" };
	response = teachers_teacherID_exams_GET(request);
	expect(response.status).toBe(400);

	request = new Request();
	request.params.teacherID = "a";
	response = teachers_teacherID_exams_GET(request);
	expect(response.status).toBe(404);

	request = new Request();
	request.params.teacherID = "-1";
	response = teachers_teacherID_exams_GET(request);
	expect(response.status).toBe(404);

	request = new Request();
	request.params.teacherID = "9.2";
	response = teachers_teacherID_exams_GET(request);
	expect(response.status).toBe(404);

	request = new Request();
	request.params.teacherID = "1";
	request.query = { offset: "9.2" };
	response = teachers_teacherID_exams_GET(request);
	expect(response.status).toBe(400);

	request = new Request();
	request.params.teacherID = "1";
	request.query = { limit: "9.2" };
	response = teachers_teacherID_exams_GET(request);
	expect(response.status).toBe(400);
});