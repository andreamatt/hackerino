
const util = require("./utility");
const Request = util.Request;
const Response = util.Response;
const doLimit = util.doLimit;
const doOffset = util.doOffset;
const isTask = util.isTask;
const isInteger = Number.isInteger;

const tasks_list = {
    /*
    1: {
        id: 1,
        question: "string",
        answers = {
            possible_answers: ["ok", "bad"],
            correct_answers: [0]
        },
        n_votes: 0,
        rating: 0
    }
    */
};

const TaskType = {
    open: "open",
    choice: "choice"
};

function Task(question) {
    let id = 1;
    while (tasks_list[id]) {
        id++;
    }

    this.id = id;
    this.question = question;
    this.n_votes = 0;
    this.rating = 0;
}

function addTask(id, question, answers) {
    let newTask = new Task(question);
    if (id) {
        newTask.id = id;
    }
    if (answers) {
        newTask.answers = answers;
    }
    return { task: newTask, isTask: isTask(newTask) };
}

Task.prototype.toString = function () {
    JSON.stringify(this);
};

function tasks_GET(req) {
    let limit = req.query.limit;
    let offset = req.query.offset;
    let tasks = Object.values(tasks_list);
    let tot_tasks = tasks.length;

    if (limit !== undefined) {
        if (!isInteger(limit)) {
            return new Response(400, "limit is NaN", null);
        }
        if (limit < 0) {
            return new Response(400, "limit is negative", null);
        }
        tasks = doLimit(tasks, limit);
    }
    if (offset !== undefined) {
        if (!isInteger(offset)) {
            return new Response(400, "offset is NaN", null);
        }
        if (offset < 0) {
            return new Response(400, "offset is negative", null);
        }
        tasks = doOffset(tasks, offset);
    }
    return new Response(200, null, { tot_tasks: tot_tasks, tasks: tasks });
}

function tasks_POST(req) {
    if (Object.keys(req.body).length > 2) {
        return new Response(400, "request body has invalid number of properties", null);
    }

    let result = addTask(null, req.body.question, req.body.answers);
    let task = result.task;
    let isTask = result.isTask.bool;
    let errMsg = result.isTask.error;

    if (isTask === true) {
        tasks_list[task.id] = task;
        return new Response(201, null, task);
    }
    else {
        return new Response(400, errMsg, null);
    }
}

module.exports = { Task, tasks_GET, tasks_POST };