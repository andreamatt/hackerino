const util = require('../utility');
const exam = require('./exam');
const exams_students = exam.exams_students;
const exams_teachers = exam.exams_teachers;
const exams_tasks = exam.exams_tasks;
const exams_list = exam.exams_list;
const createExam = exam.createExam;
const Response = util.Response;
const isString = util.isString;



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

module.exports = {
    exams_POST,
};