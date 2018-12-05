
const util = require("./utility");
const Request = util.Request;
const Response = util.Response;
const doLimit = util.doLimit;
const doOffset = util.doOffset;
const isTask = util.isTask;
const toInt = util.toInt;
const isNumber = util.isNumber;
const isString = util.isString;
const isInteger = Number.isInteger;

const exams = require("./exams");

const submissions = require("./submissions");
const submissions_submissionID_DELETE = submissions.submissions_submissionID_DELETE;

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
    let task = new Task(question);

    if (id && tasks_list[id]) {
        task.id = id;
    }

    if (answers) {
        task.answers = answers;
    }

    let result = isTask(task);
    if (result === true) {
        tasks_list[task.id] = task;
        return task;
    } else {
        return result;
    }
}

function addVote(taskID, vote) {
    let n_votes = tasks_list[taskID].n_votes;
    let rating = tasks_list[taskID].rating;
    tasks_list[taskID].n_votes++;
    tasks_list[taskID].rating = (n_votes * rating + vote) / (n_votes + 1);
}

function tasks_GET(req) {
    let tasks = Object.values(tasks_list);
    let tot_tasks = tasks.length;

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

function tasks_taskID_DELETE(req) {
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

    // get submissions with this task
    let taskReq = new Request();
    taskReq.params = taskID;
    let subsList = tasks_taskID_submissions_GET(taskReq).submissions;

    // delete submissions with this task
    let subReq = new Request();
    for (sub of subsList) {
        subReq.params.submissionID = sub.id;
        submissions_submissionID_DELETE(subReq);
    }

    // remove task from exams
    let examsList = tasks_taskID_exams_GET(taskReq).exams;
    for (exam of examsList) {
        exams.removeTask(exam.id, taskID);
    }

    delete tasks_list[taskID];
    return new Response(204, "Task removed");
}

function tasks_taskID_vote_POST(req) {
    if (Object.keys(req.body).length > 1)
        return new Response(400, "Request body has invalid number of properties");

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

    let vote = req.body.vote;
    if (!isNumber(vote)) {
        return new Response(400, "Vote is NaN");
    }
    if (vote < 0 || vote > 10) {
        return new Response(400, "Vote is out of valid range");
    }

    addVote(taskID, vote);
    return new Response(204, "Your vote was received and the task’s rating is updated");
}

function tasks_taskID_exams_GET(req) {
    if (Object.keys(req.body).length > 1) {
        return new Response(400, "Request body has invalid number of properties");
    }

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

    // get all exams
    let examsReq = new Request();
    let examsRes = exams_GET(examsReq);

    // filter exams which have not this tasks in their tasks array
    examsRes.exams = examsRes.exams.filter(exam => {
        let exams_tasks_req = new Request();
        exams_tasks_req.params = exam.id;

        let tasksList = exams_examID_tasks_GET(exams_tasks_req).tasks.map(task => task.id);
        return tasksList.includes(id);
    });

    // check query parameters
    if (req.query.offset !== undefined) {
        let offset = toInt(req.query.offset);
        if (!isInteger(offset)) {
            return new Response(400, "Offset is not an integer");
        }
        if (offset < 0) {
            return new Response(400, "Offset is negative");
        }
        examsRes.exams = doOffset(examsRes, offset);
    }
    if (req.query.limit !== undefined) {
        let limit = toInt(req.query.limit);
        if (!isInteger(limit)) {
            return new Response(400, "Limit is not an integer");
        }
        if (limit < 0) {
            return new Response(400, "Limit is negative");
        }

        examsRes.exams = doLimit(examsRes, limit);
    }

    return new Response(200, examsRes);
}

function tasks_taskID_submissions_GET(req) {
    if (Object.keys(req.body).length > 1) {
        return new Response(400, "Request body has invalid number of properties");
    }

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

    // get all submissions
    let subsReq = new Request();
    let subsRes = submissions_GET(subsReq);

    // filter submissions which have not this task as taskID
    subsRes.submissions = subsRes.submissions.filter(submission => submission.taskID === id);
    subsRes.tot_submissions = subsRes.submissions.length;

    // check query parameters
    if (req.query.offset !== undefined) {
        let offset = toInt(req.query.offset);
        if (!isInteger(offset)) {
            return new Response(400, "Offset is not an integer");
        }
        if (offset < 0) {
            return new Response(400, "Offset is negative");
        }
        subsRes.submissions = doOffset(subsRes, offset);
    }
    if (req.query.limit !== undefined) {
        let limit = toInt(req.query.limit);
        if (!isInteger(limit)) {
            return new Response(400, "Limit is not an integer");
        }
        if (limit < 0) {
            return new Response(400, "Limit is negative");
        }

        subsRes.submissions = doLimit(subsRes, limit);
    }

    return new Response(200, subsRes);
}

module.exports = {
    tasks_GET, tasks_POST,
    tasks_taskID_GET,
    tasks_taskID_PUT,
    tasks_taskID_DELETE,
    tasks_taskID_vote_POST,
    tasks_taskID_exams_GET,
    tasks_taskID_submissions_GET
};