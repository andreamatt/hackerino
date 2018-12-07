const util = require('../utility');
const sub = require('./submissions');
const submissions_list = sub.submissions_list;
const isInteger = Number.isInteger;
const Response = util.Response;
const toInt = util.toInt;



function submissions_submissionID_GET(req) {
    let id = toInt(req.params.submissionID);
    if (!isInteger(id) || id < 1) {
        return new Response(404, "Bad parameter");
    }
    if (!submissions_list[id]) {
        return new Response(404, "A submission with the specified submissionID was not found.");
    }
    let result = submissions_list[id];
    return new Response(200, result);
}



module.exports = submissions_submissionID_GET;