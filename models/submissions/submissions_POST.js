const util = require('../utility');
const sub = require('./submissions');
const students_studentID_GET = require('../students/students_studentID_GET');
const tasks_taskID_GET = require('../tasks/tasks_taskID_GET');
const exams_examID_GET = require('../exams/exams_examID_GET');
const create_submission = sub.create_submission;
const submissions_list = sub.submissions_list;
const isString = util.isString;
const Request = util.Request;
const Response = util.Response;



function submission_POST(req) {
    let studentID = req.body.studentID;
    let taskID = req.body.taskID;
    let examID = req.body.examID;
    let answer = req.body.answer;
    let chosen_answers = req.body.chosen_answers;
    let sub = create_submission(null, studentID, examID, taskID, answer, chosen_answers);

    if (isString(sub)) {
        return new Response(400, sub);
    }

    let request = new Request();
    request.params.studentID = studentID;
    request.params.examID = examID;
    request.params.taskID = taskID;

    let student_status = students_studentID_GET(request).status;
    let task_status = tasks_taskID_GET(request).status;
    let selected_exam = exams_examID_GET(request);
    let exam_status = selected_exam.status;

    if (task_status !== 200) return new Response(424, "task foreign key can't be resolved.");
    if (exam_status !== 200) return new Response(424, "exam foreign key can't be resolved.");
    if (student_status !== 200) return new Response(424, "student foreign key can't be resolved.");

    let students_array = exams_students[examID];
    let tasks_array = exams_tasks[examID];

    if (students_array.includes(studentID) === false) return new Response(424, "student foreign key can't be resolved.");
    if (tasks_array.includes(taskID) === false) return new Response(424, "task foreign key can't be resolved.");

    let result = Object.values(submissions_list);
    let filtered = result.filter(submission => {
        return (submission.studentID === studentID && submission.examID === examID && submission.taskID == taskID);
    });

    if (filtered.length === 0) {
        let deadline = selected_exam.deadline;
        let start = selected_exam.date;
        let deadlineDate = new Date(deadline);
        let startDate = new Date(start);
        let currentDate = new Date();

        if ((deadlineDate > currentDate) && (currentDate > startDate)) {
            submissions_list[sub.id] = sub;
            return new Response(201, sub);

        } else {
            return new Response(423, "Deadline reached: cannot change submission.");
        }
    } else {
        return new Response(451, "This student has already submitted this task during this exam. If you want to update it, use PUT /submissions/submissionID instead.");
    }
}



module.exports = submission_POST;