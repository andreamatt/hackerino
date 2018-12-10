const exams_list = require('./exams').exams_list;
const exams_tasks = require('./exams').exams_tasks;
const util = require('../utility');
const isInteger = util.isInteger;
const toInt = util.toInt;


function exams_examID_tasks_taskID_DELETE(req) {
    let id = toInt(req.params.examID);
    if (!isInteger(id) || id < 1) {
        return new Response(404, "Bad id parameter");
    }
    if (!exams_list[id]) {
        return new Response(404, "Exam not found");
    }

    let taskID = toInt(req.params.taskID);
    if (!isInteger(taskID) || taskID < 1) {
        return new Response(404, "Bad taskID parameter");
    }
    if (!exams_tasks[id].includes(taskID)) {
        return new Response(404, "Task is not present in this exam");
    }

    exams_tasks[id] = exams_tasks[id].filter(t => t !== taskID);
}

module.exports = exams_examID_tasks_taskID_DELETE;