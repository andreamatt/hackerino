const util = require("../utility");
const Request = util.Request;
const Response = util.Response;
const doLimit = util.doLimit;
const doOffset = util.doOffset;
const toInt = util.toInt;
const isInteger = util.isInteger;

const tasks = require("./tasks");
const tasks_list = tasks.tasks_list;

const submissions_GET = require("../submissions/submissions_GET");

function tasks_taskID_submissions_GET(req) {
    if (Object.keys(req.body).length > 0) {
        return new Response(400, "Request body must be empty");
    }

    let taskID = toInt(req.params.taskID);
    if (!isInteger(taskID)) {
        return new Response(400, "TaskID is not an integer");
    }
    if (taskID < 1) {
        return new Response(400, "TaskID invalid value");
    }
    if (!tasks_list[taskID]) {
        return new Response(404, "A task with the specified taskID was not found");
    }

    // get all submissions
    let subsReq = new Request();
    let subsRes = submissions_GET(subsReq);

    // filter submissions which have not this task as taskID
    let result = subsRes.json.submissions.filter(submission => submission.taskID === taskID);
    let tot = result.length;

    // check query parameters
    if (req.query.offset !== undefined) {
        let offset = toInt(req.query.offset);
        if (!isInteger(offset)) {
            return new Response(400, "Offset is not an integer");
        }
        if (offset < 0) {
            return new Response(400, "Offset is negative");
        }
        result = doOffset(result, offset);
    }
    if (req.query.limit !== undefined) {
        let limit = toInt(req.query.limit);
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

module.exports = tasks_taskID_submissions_GET;