const util = require('../utility');
const teachers_teacherID_GET = require('../teachers/teachers_teacherID_GET');
const exams = require('./exams');
const exams_teachers = exams.exams_teachers;
const exams_list = exams.exams_list;
const isInteger = util.isInteger;
const Response = util.Response;
const doOffset = util.doOffset;
const doLimit = util.doLimit;
const toInt = util.toInt;
const Request = util.Request;



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
        return teachers_teacherID_GET(r).json;
    });
    return new Response(200, { tot_teachers: tot, teachers: result });
}



module.exports = exams_examID_teachers_GET;