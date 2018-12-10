const exams_list = require('./exams').exams_list;
const exams_teachers = require('./exams').exams_teachers;
const util = require('../utility');
const isInteger = util.isInteger;
const toInt = util.toInt;


function exams_examID_teachers_teacherID_DELETE(req) {
    let id = toInt(req.params.examID);
    if (!isInteger(id) || id < 1) {
        return new Response(404, "Bad id parameter");
    }
    if (!exams_list[id]) {
        return new Response(404, "Exam not found");
    }

    let teacherID = toInt(req.params.teacherID);
    if (!isInteger(teacherID) || teacherID < 1) {
        return new Response(404, "Bad teacherID parameter");
    }
    if (!exams_teachers[id].includes(teacherID)) {
        return new Response(404, "Teacher is not signed up for this exam");
    }

    exams_teachers[id] = exams_teachers[id].filter(t => t !== teacherID);
    exams_list[id].tot_teachers--;
}

module.exports = exams_examID_teachers_teacherID_DELETE;