const util = require('../utility');
const tasks = require('../tasks');
const exams_tasks = exam.exams_tasks;
const exams_list = exam.exams_list;
const isInteger = util.isInteger;
const Response = util.Response;
const toInt = util.toInt;



function exams_examID_tasks_POST(req) {
    let id = toInt(req.params.examID);
    if (!isInteger(id) || id < 1) {
        return new Response(404, "Bad id parameter");
    }
    if (!exams_list[id]) {
        return new Response(404, "Exam not found");
    }

    let taskID = req.body.taskID;
    if (!isInteger(taskID) || taskID < 1) {
        return new Response(400, "Bad taskID parameter");
    }
    if (exams_tasks[id].includes(taskID)) {
        return new Response(423, "Task already signed up");
    }
    let stud_req = new Request();
    stud_req.params.taskID = taskID;
    let stud_res = tasks.tasks_taskID_GET(stud_req);
    if (stud_res.status !== 200) {
        return new Response(424, "Task not found therefore not added");
    } else {
        exams_tasks[id].push(taskID);
        return new Response(204, "Task added to exam");
    }
}



module.exports = {
    exams_examID_tasks_POST
};