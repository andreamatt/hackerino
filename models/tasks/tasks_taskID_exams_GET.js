const util = require("../utility");
const Request = util.Request;
const Response = util.Response;
const doLimit = util.doLimit;
const doOffset = util.doOffset;
const toInt = util.toInt;
const isInteger = util.isInteger;

const tasks = require("./tasks");
const tasks_list = tasks.tasks_list;

//const exams_GET = require("../exams/exams_GET");
//const exams_examID_tasks_GET = require("../exams/exams_examID_tasks_GET");

function tasks_taskID_exams_GET(req) {
    if (Object.keys(req.body).length > 1) {
        return new Response(400, "Request body has invalid number of properties");
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

    // get all exams
    let examsReq = new Request();
    let examsRes = exams_GET(examsReq);

    // filter exams which have not this tasks in their tasks array
    examsRes.exams = examsRes.exams.filter(exam => {
        let exams_tasks_req = new Request();
        exams_tasks_req.params = exam.id;

        let tasksList = exams_examID_tasks_GET(exams_tasks_req).tasks.map(task => task.id);
        return tasksList.includes(id);
    });

    // check query parameters
    if (req.query.offset !== undefined) {
        let offset = toInt(req.query.offset);
        if (!isInteger(offset)) {
            return new Response(400, "Offset is not an integer");
        }
        if (offset < 0) {
            return new Response(400, "Offset is negative");
        }
        examsRes.exams = doOffset(examsRes, offset);
    }
    if (req.query.limit !== undefined) {
        let limit = toInt(req.query.limit);
        if (!isInteger(limit)) {
            return new Response(400, "Limit is not an integer");
        }
        if (limit < 0) {
            return new Response(400, "Limit is negative");
        }

        examsRes.exams = doLimit(examsRes, limit);
    }

    return new Response(200, examsRes);
}

module.exports = tasks_taskID_exams_GET;