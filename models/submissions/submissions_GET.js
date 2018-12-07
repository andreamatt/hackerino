const util = require('../utility');
const sub = require('./submissions');
const submissions_list = sub.submissions_list;
const isInteger = Number.isInteger;
const Response = util.Response;
const doOffset = util.doOffset;
const doLimit = util.doLimit;
const toInt = util.toInt;



function submissions_GET(req) {
    let result = Object.values(submissions_list);
    let offset = req.query.offset;
    let limit = req.query.limit;
    let tot = result.length;

    if (offset !== undefined) {
        let offset = toInt(req.query.offset);
        if (!isInteger(offset)) {
            return new Response(400, "Bad offset query");
        }
        if (offset < 0) {
            return new Response(400, "Offset is negative");
        }
        result = doOffset(result, offset);
    }

    if (limit !== undefined) {
        let limit = toInt(req.query.limit);
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



module.exports = submissions_GET;