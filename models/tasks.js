
const util = require("./utility");
const Request = util.Request;
const Response = util.Response;
const doLimit = util.doLimit;
const doOffset = util.doOffset;

const tasks_list = {
    /*
    1: {
        id: 1,
        type: "choice",
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

function Task() {
    this.id = 0;
    this.type = "";
    this.question = "";
    this.answers = {
        possible_answers: ["ok", "bad"],
        correct_answers: [0]
    };
    this.n_votes = 0;
    this.rating = 0;
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
        if (!Number.isInteger(limit)) {
            return new Response(400, "limit is NaN", null);
        }
        if (limit < 0) {
            return new Response(400, "limit is negative", null);
        }
        tasks = doLimit(tasks, limit);
    }
    if (offset !== undefined) {
        if (!Number.isInteger(offset)) {
            return new Response(400, "offset is NaN", null);
        }
        if (offset < 0) {
            return new Response(400, "offset is negative", null);
        }
        tasks = doOffset(tasks, offset);
    }
    return new Response(200, null, { tot_tasks: tot_tasks, tasks: tasks });
}

module.exports = { Task, tasks_GET };