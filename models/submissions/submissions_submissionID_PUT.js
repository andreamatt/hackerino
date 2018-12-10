const exams = require('../exams/exams');
const tasks = require('../tasks/tasks');
const util = require('../utility');
const sub = require('./submissions');
const submissions_list = sub.submissions_list;
const Response = util.Response;
const isString = util.isString;
const Request = util.Request;
const toInt = util.toInt;



function submission_submissionID_PUT(req) {
    let id = toInt(req.params.submissionID);
    let studentID = req.body.studentID;
    let examID = req.body.examID;
    let taskID = req.body.taskID;
    let answer = req.body.answer;
    let chosen_answers = req.body.chosen_answers;
    let result = create_submission(id, studentID, examID, taskID, answer, chosen_answers);

    if (isString(result)) {
        return new Response(400, result);
    }

    let request = new Request();
    request.params.studentID = studentID;
    request.params.examID = examID;
    request.params.taskID = taskID;

    let student_status = students_studentID_GET(request).status;
    let task_status = tasks_taskID_GET(request).status;
    let selected_exam = exams_examID_GET(request);
    let exam_status = selected_exam.status;

    if (student_status !== 200) return new Response(424, "studentID foreign key can't be resolved.");
    if (task_status !== 200) return new Response(424, "taskID foreign key can't be resolved.");
    if (exam_status !== 200) return new Response(424, "examID foreign key can't be resolved.");

    let students_array = exams_students[examID];
    let tasks_array = exams_tasks[examID];

    if (students_array.includes(studentID) === false) return new Response(424, "student foreign key can't be resolved.");
    if (tasks_array.includes(taskID) === false) return new Response(424, "task foreign key can't be resolved.");

    let deadline = new Date(selected_exam.deadline);
    let start = new Date(selected_exam.date);
    let currentDate = new Date();
    let inTime = (deadline > currentDate) && (currentDate > start);

    if (!inTime) {
        return new Response(451, "Cannot submit the submission right now: too early or too late.");
    }

    if (submissions_list[id]) {
        let oldSub = submissions_list[id];
        if (oldSub.studentID !== studentID || oldSub.examID !== examID || oldSub.taskID !== taskID) {
            return new Response(400, "Bad request");
        }
        submissions_list[id] = result;
        return new Response(200, "Submission updated.");
    }

    let sub_list = Object.values(submissions_list);
    let filtered = sub_list.filter(submission => {
        return (submission.studentID === studentID && submission.examID === examID && submission.taskID == taskID);
    });

    if (filtered.length > 0) {
        return new Response(423, "The ID was not resolved => tried to create a new submission. Another submission with the same student, exam and task already exists.");
    }

    submissions_list[id] = result;
    return new Response(200, "Submission added to the exam.");
}



module.exports = submission_submissionID_PUT;