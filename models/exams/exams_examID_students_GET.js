const exams = require('./exams');
const util = require('../utility');
const students_studentID_GET = require('../students/students_studentID_GET');
const exams_students = exams.exams_students;
const exams_list = exams.exams_list;
const isInteger = util.isInteger;
const Response = util.Response;
const doOffset = util.doOffset;
const doLimit = util.doLimit;
const toInt = util.toInt;
const Request = util.Request;


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
        return students_studentID_GET(r).json;
    });
    return new Response(200, { tot_students: tot, students: result });
}



module.exports = exams_examID_students_GET;