const util = require("../utility");
const Response = util.Response;
const doLimit = util.doLimit;
const doOffset = util.doOffset;
const toInt = util.toInt;
const isInteger = util.isInteger;

const tasks = require("./tasks");
const tasks_list = tasks.tasks_list;

function tasks_GET(req) {
    let tasks = Object.values(tasks_list);
    let tot_tasks = tasks.length;

    if (Object.keys(req.body).length > 0) {
        return new Response(400, "Request body must be empty");
    }

    if (req.query.offset !== undefined) {
        let offset = toInt(req.query.offset);
        if (!isInteger(offset)) {
            return new Response(400, "Offset is not an integer");
        }
        if (offset < 0) {
            return new Response(400, "Offset is negative");
        }

        tasks = doOffset(tasks, offset);
    }
    if (req.query.limit !== undefined) {
        let limit = toInt(req.query.limit);
        if (!isInteger(limit)) {
            return new Response(400, "Limit is not an integer");
        }
        if (limit < 0) {
            return new Response(400, "Limit is negative");
        }

        tasks = doLimit(tasks, limit);
    }
    return new Response(200, { tot_tasks: tot_tasks, tasks: tasks });
}

module.exports = tasks_GET;