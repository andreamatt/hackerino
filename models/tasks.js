
const util = require("./utility");
const Response = util.Response;
const doLimit = util.doLimit;
const doOffset = util.doOffset;
const isTask = util.isTask;
const toInt = util.toInt;
const isNumber = util.isNumber;
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
            return new Response(400, "Limit is not an integer", null);
        }
        if (limit < 0) {
            return new Response(400, "Limit is negative", null);
        }
        tasks = doLimit(tasks, limit);
    }
    if (req.query.offset !== undefined) {
        let offset = toInt(req.query.offset);
        if (!isInteger(offset)) {
            return new Response(400, "Offset is not an integer", null);
        }
        if (offset < 0) {
            return new Response(400, "Offset is negative", null);
        }
        tasks = doOffset(tasks, offset);
    }
    return new Response(200, null, { tot_tasks: tot_tasks, tasks: tasks });
}

function tasks_POST(req) {
    if (Object.keys(req.body).length > 2) {
        return new Response(400, "Request body has invalid number of properties", null);
    }

    let result = createTask(null, req.body.question, req.body.answers);
    let task = result.task;
    let isTask = result.isTask.bool;
    let errMsg = result.isTask.error;
    if (!isTask === true) {
        return new Response(400, errMsg, null);
    }

    let byQuestion = Object.values(tasks_list).filter(t => t.question === task.question);
    if (byQuestion.length > 0) {
        return new Response(423, "A task with such question already exists", null);
    }

    tasks_list[task.id] = task;
    return new Response(201, null, task);
}

function tasks_taskID_GET(req) {
    let id = toInt(req.params.taskID);

    if (!isInteger(id)) {
        return new Response(400, "TaskID is not an integer", null);
    }
    if (id < 1) {
        return new Response(400, "TaskID invalid value", null);
    }
    if (!tasks_list[id]) {
        return new Response(404, "A task with the specified taskID was not found", null);
    }
    return new Response(200, null, tasks_list[id]);
}

function tasks_taskID_PUT(req) {
    let id = toInt(req.params.taskID);
    if (!isInteger(id)) {
        return new Response(400, "TaskID is not an integer", null);
    }
    if (id < 1) {
        return new Response(400, "TaskID invalid value", null);
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

    let byQuestion = Object.values(tasks_list).filter(t => t.question === task.question);
    if (byQuestion.length > 0) {
        return new Response(423, "A task with such question already exists", null);
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
        return new Response(400, "TaskID is not an integer", null);
    }
    if (id < 1) {
        return new Response(400, "TaskID invalid value", null);
    }
    if (!tasks_list[id]) {
        return new Response(404, "A task with the specified taskID was not found", null);
    }

    delete tasks_list[id];
    return new Response(204, "Task removed", null);
}

function tasks_taskID_vote_POST(req) {
    if (Object.keys(req.body).length > 1) {
        return new Response(400, "Request body has invalid number of properties", null);
    }

    let id = toInt(req.params.taskID);
    if (!isInteger(id)) {
        return new Response(400, "TaskID is not an integer", null);
    }
    if (id < 1) {
        return new Response(400, "TaskID invalid value", null);
    }
    if (!tasks_list[id]) {
        return new Response(404, "A task with the specified taskID was not found", null);
    }

    let vote = req.body.vote;
    if (!isNumber(vote)) {
        return new Response(400, "Vote is NaN", null);
    }
    if (vote < 0 || vote > 10) {
        return new Response(400, "Vote is out of valid range", null);
    }

    let n_votes = tasks_list[id].n_votes;
    let rating = tasks_list[id].rating;
    tasks_list[id].n_votes++;
    tasks_list[id].rating = (n_votes * rating + vote) / (n_votes + 1);
    return new Response(204, "Your vote was received and the task’s rating is updated", null);
}

module.exports = { tasks_GET, tasks_POST, tasks_taskID_GET, tasks_taskID_PUT, tasks_taskID_DELETE, tasks_taskID_vote_POST };