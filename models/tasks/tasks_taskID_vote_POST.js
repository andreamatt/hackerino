const util = require("../utility");
const Response = util.Response;
const toInt = util.toInt;
const isInteger = util.isInteger;

const tasks = require("./tasks");
const tasks_list = tasks.tasks_list;
const addVote = tasks.addVote;

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
    if (!isInteger(vote)) {
        return new Response(400, "Vote is not an integer");
    }
    if (vote < 0 || vote > 10) {
        return new Response(400, "Vote is out of valid range");
    }

    addVote(taskID, vote);
    return new Response(204, "Your vote was received and the task’s rating is updated");
}

module.exports = tasks_taskID_vote_POST;