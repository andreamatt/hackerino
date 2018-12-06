const util = require('../utility');
const submissions = require('../submissions');
const isInteger = util.isInteger;
const Response = util.Response;
const doOffset = util.doOffset;
const doLimit = util.doLimit;
const toInt = util.toInt;



function exams_examID_submissions_GET(req) {
    let id = toInt(req.params.examID);
    if (!isInteger(id) || id < 1) {
        return new Response(404, "Bad id parameter");
    }
    if (!exams_list[id]) {
        return new Response(404, "Exam not found");
    }

    let sub_req = new Request();
    let result = submissions.submissions_GET(sub_req).submissions;
    result = result.filter(sub => sub.examID === id);

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
    return new Response(200, { tot_submissions: tot, submissions: result });
}

module.exports = {
    exams_examID_submissions_GET
};