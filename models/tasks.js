
const util = require("./utility");
const Response = util.Response;
const doLimit = util.doLimit;
const doOffset = util.doOffset;
const isTask = util.isTask;
const toInt = util.toInt;
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

function createTask(id, question, answers) {
    let newTask = new Task(question);
    if (id) {
        newTask.id = id;
    }
    if (answers) {
        newTask.answers = answers;
    }
    return { task: newTask, isTask: isTask(newTask) };
}

function tasks_GET(req) {
    let tasks = Object.values(tasks_list);
    let tot_tasks = tasks.length;

    if (req.query.limit !== undefined) {
        let limit = toInt(req.query.limit);
        if (!isInteger(limit)) {
            return new Response(400, "limit is NaN", null);
        }
        if (limit < 0) {
            return new Response(400, "limit is negative", null);
        }
        tasks = doLimit(tasks, limit);
    }
    if (req.query.offset !== undefined) {
        let offset = toInt(req.query.offset);
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

    let result = createTask(null, req.body.question, req.body.answers);
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

function tasks_taskID_GET(req) {
    let id = toInt(req.params.taskID);

    if (!isInteger(id)) {
        return new Response(400, "taskID is NaN", null);
    }
    if (id < 1) {
        return new Response(400, "taskID invalid value", null);
    }
    if (!tasks_list[id]) {
        return new Response(404, "A task with the specified taskID was not found", null);
    }
    return new Response(200, null, tasks_list[id]);
}

function tasks_taskID_PUT(req) {
    let id = toInt(req.params.taskID);
    if (!isInteger(id)) {
        return new Response(400, "taskID is NaN", null);
    }
    if (id < 1) {
        return new Response(400, "taskID invalid value", null);
    }

    let status;
    let result;
    if (tasks_list[id]) {
        status = "update";
        result = createTask(id, req.body.question, req.body.answers);
    } else {
        status = "create";
        result = createTask(null, req.body.question, req.body.answers);
    }

    let task = result.task;
    let isTask = result.isTask.bool;
    let errMsg = result.isTask.error;
    if (!isTask === true) {
        return new Response(400, errMsg, null);
    }

    tasks_list[task.id] = task;
    if (status === "update") {
        return new Response(200, "Task updated", null);
    } else {
        return new Response(201, "Task created", null);
    }
}

function tasks_taskID_DELETE(req) {
    let id = toInt(req.params.taskID);

    if (!isInteger(id)) {
        return new Response(400, "taskID is NaN", null);
    }
    if (id < 1) {
        return new Response(400, "taskID invalid value", null);
    }
    if (!tasks_list[id]) {
        return new Response(404, "A task with the specified taskID was not found", null);
    }

    delete tasks_list[id];
    return new Response(204, "Task removed", null);
}

module.exports = { tasks_GET, tasks_POST, tasks_taskID_GET, tasks_taskID_PUT, tasks_taskID_DELETE };