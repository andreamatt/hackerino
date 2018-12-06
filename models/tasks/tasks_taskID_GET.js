const util = require("../utility");
const Response = util.Response;
const toInt = util.toInt;
const isInteger = util.isInteger;

const tasks = require("./tasks");
const tasks_list = tasks.tasks_list;

function tasks_taskID_GET(req) {
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
    return new Response(200, tasks_list[taskID]);
}

module.exports = tasks_taskID_GET;