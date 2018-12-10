const util = require("../utility");
const Response = util.Response;
const isString = util.isString;

const tasks = require("./tasks");
const createTask = tasks.createTask;

function tasks_POST(req) {
    let question = req.body.question;
    if (tasks.isUnique(question) === false) {
        return new Response(423, "A task with such question already exists");
    }

    let result = createTask(null, req.body.question, req.body.answers);
    if (isString(result)) {
        return new Response(400, result);
    }
    return new Response(201, result);
}

module.exports = tasks_POST;