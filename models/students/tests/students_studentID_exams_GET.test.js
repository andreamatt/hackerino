const students_studentID_exams_GET = require('../students_studentID_exams_GET');
const exams_examID_students_GET = require('../../exams/exams_examID_students_GET');
const util = require('../../utility');
const Request = util.Request;
const resetDB = require('../../sampleDB').resetDB;

beforeEach(resetDB);

test("students_studentID_exams_GET", () => {
	// let student_id = 1;
	// let exam_id = 4;

	// get exam's students
	request = new Request();
	request.params.examID = "4";
	response = exams_examID_students_GET(request);
	expect(response.status).toBe(200);
	let students = response.json.students;
	expect(students.filter(s => s.id === 1).length).toBe(1);
	expect(students.length > 0).toBe(true);
	expect(util.isStudent(students[0])).toBe(true);
	expect(students.map(s => s.id).includes(1)).toBe(true);

	// get exams
	request = new Request();
	request.params.studentID = "1";
	response = students_studentID_exams_GET(request);
	expect(response.status).toBe(200);
	let exams = response.json.exams;
	expect(exams.length > 0).toBe(true);
	expect(util.isExam(exams[0])).toBe(true);
	expect(exams.map(e => e.id)).toEqual([2, 4]);

	request = new Request();
	request.params.studentID = "1";
	request.query = { offset: "1", limit: "1" };
	response = students_studentID_exams_GET(request);
	expect(response.status).toBe(200);
	exams = response.json.exams;
	expect(exams.length > 0).toBe(true);
	expect(util.isExam(exams[0])).toBe(true);
	expect(exams.map(e => e.id)).toEqual([4]);

	request = new Request();
	request.params.studentID = "1";
	request.query = { offset: "-1" };
	response = students_studentID_exams_GET(request);
	expect(response.status).toBe(400);

	request = new Request();
	request.params.studentID = "1";
	request.query = { offset: "a" };
	response = students_studentID_exams_GET(request);
	expect(response.status).toBe(400);

	request = new Request();
	request.params.studentID = "1";
	request.query = { limit: "-1" };
	response = students_studentID_exams_GET(request);
	expect(response.status).toBe(400);

	request = new Request();
	request.params.studentID = "1";
	request.query = { limit: "a" };
	response = students_studentID_exams_GET(request);
	expect(response.status).toBe(400);

	request = new Request();
	request.params.studentID = "a";
	response = students_studentID_exams_GET(request);
	expect(response.status).toBe(404);

	request = new Request();
	request.params.studentID = "-1";
	response = students_studentID_exams_GET(request);
	expect(response.status).toBe(404);

	request = new Request();
	request.params.studentID = "9.2";
	response = students_studentID_exams_GET(request);
	expect(response.status).toBe(404);

	request = new Request();
	request.params.studentID = "1";
	request.query = { offset: "9.2" };
	response = students_studentID_exams_GET(request);
	expect(response.status).toBe(400);

	request = new Request();
	request.params.studentID = "1";
	request.query = { limit: "9.2" };
	response = students_studentID_exams_GET(request);
	expect(response.status).toBe(400);
});