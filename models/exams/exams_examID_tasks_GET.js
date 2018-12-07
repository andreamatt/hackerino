const util = require('../utility');
const tasks_GET = require('../tasks/tasks_GET');
const exams = require('./exams');
const exams_tasks = exams.exams_tasks;
const exams_list = exams.exams_list;
const isInteger = util.isInteger;
const Response = util.Response;
const doOffset = util.doOffset;
const doLimit = util.doLimit;
const toInt = util.toInt;



function exams_examID_tasks_GET(req) {
    let id = toInt(req.params.examID);
    if (!isInteger(id) || id < 1) {
        return new Response(404, "Bad id parameter");
    }
    if (!exams_list[id]) {
        return new Response(404, "Exam not found");
    }

    let result = exams_tasks[id];
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
    result = result.map(taskID => {
        let r = new Request();
        r.params.taskID = taskID;
        return tasks_GET(r);
    });
    return new Response(200, { tot_tasks: tot, tasks: result });
}



module.exports = exams_examID_tasks_GET;