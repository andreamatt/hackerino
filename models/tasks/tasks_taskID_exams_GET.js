const util = require("../utility");
const Request = util.Request;
const Response = util.Response;
const doLimit = util.doLimit;
const doOffset = util.doOffset;
const toInt = util.toInt;
const isInteger = util.isInteger;

const tasks = require("./tasks");
const tasks_list = tasks.tasks_list;

const exams_tasks = require("../exams/exams").exams_tasks;
const exams_GET = require("../exams/exams_GET");
const exams_examID_tasks_GET = require("../exams/exams_examID_tasks_GET");

function tasks_taskID_exams_GET(req) {
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

    // get all exams
    let examsReq = new Request();
    let examsRes = exams_GET(examsReq);

    // filter exams which have not this tasks in their tasks array
    let result = examsRes.json.exams.filter(exam => {
        //return exams_tasks[exam.id].includes(taskID); // alternative
        let exams_tasks_req = new Request();
        exams_tasks_req.params.examID = exam.id;

        let tasksList = exams_examID_tasks_GET(exams_tasks_req);
        tasksList = exams_examID_tasks_GET(exams_tasks_req).json.tasks.map(task => task.id);
        return tasksList.includes(taskID);
    });
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

    return new Response(200, { tot_exams: tot, exams: result });
}

module.exports = tasks_taskID_exams_GET;