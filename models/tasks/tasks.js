const util = require("../utility");
const isTask = util.isTask;

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

    // update mode
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

module.exports = { tasks_list, createTask, addVote };