const util = require("../utility");
const Response = util.Response;
const toInt = util.toInt;
const isString = util.isString;
const isInteger = util.isInteger;

const tasks = require("./tasks");
const tasks_list = tasks.tasks_list;
const createTask = tasks.createTask;

function tasks_taskID_PUT(req) {
    let taskID = toInt(req.params.taskID);

    if (!isInteger(taskID))
        return new Response(400, "TaskID is not an integer");
    if (taskID < 1)
        return new Response(400, "TaskID invalid value");

    let byQuestion = Object.values(tasks_list).filter(t => t.question === req.body.question);
    if (byQuestion.length > 0) {
        return new Response(423, "A task with such question already exists");
    }

    let status = tasks_list[taskID] ? "update" : "create";
    let result = createTask(taskID, req.body.question, req.body.answers);

    if (isString(result)) {
        return new Response(400, result);
    }

    if (status === "update") {
        return new Response(200, "Task updated");
    }
    else {
        return new Response(201, "Task created");
    }
}

module.exports = tasks_taskID_PUT;