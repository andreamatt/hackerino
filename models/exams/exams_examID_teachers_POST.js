const util = require('../utility');
const teachers_teacherID_GET = require('../teachers/teachers_teacherID_GET');
const exams = require('./exams');
const exams_teachers = exams.exams_teachers;
const exams_list = exams.exams_list;
const isInteger = util.isInteger;
const Response = util.Response;
const toInt = util.toInt;
const Request = util.Request;



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
    let stud_res = teachers_teacherID_GET(stud_req);
    if (stud_res.status !== 200) {
        return new Response(424, "Teacher not found therefore not added");
    } else {
        exams_teachers[id].push(teacherID);
        exams_list[id].tot_teachers++;
        return new Response(204, "Teacher added to exam");
    }
}



module.exports = exams_examID_teachers_POST;