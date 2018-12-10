const exams_list = require('./exams').exams_list;
const exams_students = require('./exams').exams_students;
const util = require('../utility');
const isInteger = util.isInteger;
const toInt = util.toInt;


function exams_examID_students_studentID_DELETE(req) {
    let id = toInt(req.params.examID);
    if (!isInteger(id) || id < 1) {
        return new Response(404, "Bad id parameter");
    }
    if (!exams_list[id]) {
        return new Response(404, "Exam not found");
    }

    let studentID = toInt(req.params.studentID);
    if (!isInteger(studentID) || studentID < 1) {
        return new Response(404, "Bad studentID parameter");
    }
    if (!exams_students[id].includes(studentID)) {
        return new Response(404, "Student is not signed up for this exam");
    }

    exams_students[id] = exams_students[id].filter(s => s !== studentID);
    exams_list[id].tot_students--;
}

module.exports = exams_examID_students_studentID_DELETE;