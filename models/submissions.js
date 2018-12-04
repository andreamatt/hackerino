const Response = require('./response');
const students = require('./students');
const util = require('./utility');
const exams = require('./exams');
const tasks = require('./tasks');
const Request = util.Request;
const toInt = util.toInt;
const isInteger = Number.isInteger;
const isString = util.isString;
const doOffset = util.doOffset;
const doLimit = util.doLimit;
const isSubmission = util.isSubmission;

const Badrequest = new Response(400, "Bad request");
const submissions_list = {};

function Submission(student, exam, task, answer, chosen_aswer) {
    this.id = 1;
    while (submissions_list[this.id]) {
        this.id++;
    }

    this.studentID = student;
    this.examID = exam;
    this.taskID = task;
    this.answer = answer;
    this.chosen_aswer = chosen_aswer;
    this.review_points = 0;
    this.final_points = 0;
}

function create_submission(id, studentID, examID, taskID, answer, chosen_answer) {
    let sub = new Submission(studentID, examID, taskID, answer, chosen_answer);
    if (id != null && id != undefined) {
        sub.id = id;
    }
    let result = isSubmission(sub);
    if (result) {
        return sub;
    } else {
        return result;
    }
}


function getByExamID(ID) {
    return Object.values(submissions_list).filter(sub => {
        return sub.exam === ID;
    });
}

function getByTaskID(ID) {
    return Object.values(submissions_list).filter(sub => {
        return sub.task === ID;
    });
}

function getByStudentID(ID) {
    return Object.values(submissions_list).filter(sub => {
        return sub.student === ID;
    });
}

function submissions_GET(req) {
    let result = Object.values(submissions_list);
    let examID = req.query.examID;
    let taskID = req.query.taskID;
    let studentID = req.query.studentID;

    if (examID !== undefined) {
        if (!isInteger(examID)) {
            return new Response(400, "Bad examID query");
        }
        result = getByExamID(examID);
    }
    if (taskID !== undefined) {
        if (!isInteger(taskID)) {
            return new Response(400, "Bad taskID query");
        }
        result = getByTaskID(examID);
    }
    if (studentID !== undefined) {
        if (!isInteger(studentID)) {
            return new Response(400, "Bad studentID query");
        }
        result = getByStudentID(examID);
    }

    let tot = result.length;
    let offset = req.query.offset;

    if (offset !== undefined) {
        if (!isInteger(offset)) {
            return new Response(400, "Bad offset query");
        }
        if (offset < 0) {
            return new Response(400, "Offset is negative");
        }
        result = doOffset(result, offset);
    }
    let limit = req.query.limit;
    if (limit !== undefined) {
        if (!isInteger(limit)) {
            return new Response(400, "Bad limit query");
        }
        if (limit < 0) {
            return new Response(400, "Limit is negative");
        }
        result = doLimit(result, limit);
    }

    return new Response(200, { tot_submissions: tot, submissions: result });
}

function submission_POST(req) {
    let studentID = req.body.studentID;
    let taskID = req.body.taskID;
    let examID = req.body.examID;
    let answer = req.body.answer;
    let chosen_answer = req.body.chosen_answer;
    let sub = create_submission(null, studentID, taskID, examID, answer, chosen_answer);

    if (isString(sub)) {
        return new Response(400, sub);
    }

    let request = new Request();
    request.params.studentID = studentID;
    request.params.examID = examID;
    request.params.taskID = taskID;

    let student_status = student.students_studentID_GET(request).status;
    let task_status = tasks.tasks_taskID_GET(request).status;
    let selected_exam = exams.exams_examID_GET(request);
    let exam_status = selected_exam.status;

    if (task_status !== 200) return new Response(424, "task foreign key can't be resolved.");
    if (exam_status !== 200) return new Response(424, "exam foreign key can't be resolved.");
    if (student_status !== 200) return new Response(424, "student foreign key can't be resolved.");

    let result = Object.values(submissions_list);
    let filtered = result.filter(submission => {
        return (submission.studentID === studentID && submission.examID === examID && submission.taskID == taskID);
    });

    if (filtered.length === 0) {
        let deadline = selected_exam.json.deadline;
        let deadlineDate = new Date(deadline);
        let currentDate = new Date();
        let notLate = deadlineDate > currentDate;

        if (notLate) {
            submissions_list[sub.id] = sub;
            return new Response(201, sub);

        } else {
            return new Response(423, "Deadline reached: cannot change submission.");
        }
    } else {
        return new Response(451, "This student has already submitted this task during this exam. If you want to update it, use PUT /submissions/submissionID instead.");
    }

}

module.exports = { getByExamID, getByStudentID, getByTaskID, submissions_GET, submission_POST };
