const util = require('../utility');
const exam = require('./exam');
const exams_list = exam.exams_list;
const isInteger = util.isInteger;
const Response = util.Response;
const doOffset = util.doOffset;
const doLimit = util.doLimit;
const toInt = util.toInt;



function exams_GET(req) {
    let result = Object.values(exams_list);
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
    return new Response(200, { tot_exams: tot, exams: result });
}

module.exports = {
    exams_GET,
};