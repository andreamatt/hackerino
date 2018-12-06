const util = require('../utility');
const sub = require('./submission');
const submissions_list = sub.submissions_list;
const getByStudentID = sub.getByStudentID;
const getByExamID = sub.getByExamID;
const getByTaskID = sub.getByTaskID;
const isInteger = Number.isInteger;
const Response = util.Response;
const doOffset = util.doOffset;
const doLimit = util.doLimit;
const toInt = util.toInt;



function submissions_GET(req) {
    let result = Object.values(submissions_list);
    let examID = toInt(req.query.examID);
    let taskID = toInt(req.query.taskID);
    let studentID = toInt(req.query.studentID);

    if (examID !== undefined) {
        if (!isInteger(examID)) {
            return new Response(400, "Bad examID query");
        }
        result = getByExamID(examID);
    }
    if (taskID !== undefined) {
        if (!isInteger(taskID)) {
            return new Response(400, "Bad taskID query");
        }
        result = getByTaskID(examID);
    }
    if (studentID !== undefined) {
        if (!isInteger(studentID)) {
            return new Response(400, "Bad studentID query");
        }
        result = getByStudentID(examID);
    }

    let tot = result.length;
    let offset = req.query.offset;

    if (offset !== undefined) {
        if (!isInteger(offset)) {
            return new Response(400, "Bad offset query");
        }
        if (offset < 0) {
            return new Response(400, "Offset is negative");
        }
        result = doOffset(result, offset);
    }
    let limit = req.query.limit;
    if (limit !== undefined) {
        if (!isInteger(limit)) {
            return new Response(400, "Bad limit query");
        }
        if (limit < 0) {
            return new Response(400, "Limit is negative");
        }
        result = doLimit(result, limit);
    }

    return new Response(200, { tot_submissions: tot, submissions: result });
}



module.exports = {
    submissions_GET
};