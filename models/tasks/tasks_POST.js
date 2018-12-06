const util = require("../utility");
const Response = util.Response;
const isString = util.isString;

const tasks = require("./tasks");
const tasks_list = tasks.tasks_list;
const createTask = tasks.createTask;

function tasks_POST(req) {
    if (Object.keys(req.body).length > 2) {
        return new Response(400, "Request body has invalid number of properties");
    }

    let byQuestion = Object.values(tasks_list).filter(t => t.question === req.body.question);
    if (byQuestion.length > 0) {
        return new Response(423, "A task with such question already exists");
    }

    let result = createTask(null, req.body.question, req.body.answers);
    if (isString(result)) {
        return new Response(400, result);
    }
    return new Response(201, result);
}

module.exports = tasks_POST;