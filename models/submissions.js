const student = require('./students');
const util = require('./utility');
const exams = require('./exams');
const tasks = require('./tasks');
const reviews = require('./reviews');
const isSubmission = util.isSubmission;
const isInteger = Number.isInteger;
const Response = util.Response;
const isString = util.isString;
const doOffset = util.doOffset;
const Request = util.Request;
const doLimit = util.doLimit;
const toInt = util.toInt;

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
    this.chosen_answer = chosen_aswer;
    this.review_points = 0;
    this.final_points = 0;
}

function create_submission(id, studentID, examID, taskID, answer, chosen_answer) {
    let sub = new Submission(studentID, examID, taskID, answer, chosen_answer);
    if (id != null && id != undefined) {
        sub.id = id;
    }
    let result = isSubmission(sub);
    if (isString(result)) {
        return result;
    } else {
        return sub;
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
    let sub = create_submission(null, studentID, examID, taskID, answer, chosen_answer);

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
    let filtered = result.filter(sub => {
        return sub.examID === examID && sub.studentID === studentID && sub.taskID === taskID;
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

function submissions_submissionID_GET(req) {
    let id = toInt(req.params.submissionID);
    if (!isInteger(id) || id < 1) {
        return new Response(404, "Bad parameter");
    }
    if (!submissions_list[id]) {
        return new Response(404, "A submission with the specified submissionID was not found.");
    }
    let result = submissions_list[id];
    return new Response(200, result);
}

function submissions_submissionID_DELETE(req) {
    let id = toInt(req.params.submissionID);
    if (!isInteger(id) || id < 1) {
        return new Response(404, "Bad parameter");
    }
    if (!submissions_list[id]) {
        return new Response(404, "Could not remove the submission with the specified submissionID (submission not found).");
    }

    let request = new Request();
    let reviews_list = reviews.reviews_GET(request);
    let filtered = reviews_list.filter(review => {
        return review.submissionID === id;
    });

    delete submissions_list[id];
    for (let entry in filtered) {
        reviews.reviews_reviewID_DELETE(entry.id);
    }

    return new Response(204, "Submission removed.");
}

function submission_submissionID_PUT(req) {
    let id = toInt(req.params.submissionID);
    let studentID = req.body.studentID;
    let examID = req.body.examID;
    let taskID = req.body.taskID;
    let answer = req.body.answer;
    let chosen_answer = req.body.chosen_answer;
    let result = create_submission(id, studentID, examID, taskID, answer, chosen_answer);

    if (isString(result)) {
        return new Response(400, result);
    }

    let request = new Request();
    request.params.studentID = studentID;
    request.params.examID = examID;
    request.params.taskID = taskID;

    let student_status = student.students_studentID_GET(request).status;
    let task_status = tasks.tasks_taskID_GET(request).status;
    let selected_exam = exams.exams_examID_GET(request);
    let exam_status = selected_exam.status;

    if (student_status !== 200) return new Response(424, "studentID foreign key can't be resolved.");
    if (task_status !== 200) return new Response(424, "taskID foreign key can't be resolved.");
    if (exam_status !== 200) return new Response(424, "examID foreign key can't be resolved.");

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

function submissions_submissionID_review_GET(req) {
    let id = toInt(req.params.id);
    let limit = toInt(req.query.limit);
    let offset = toInt(req.query.offset);

    if (!isInteger(id) || id < 1) {
        return new Response(400, "Bad id paramater");
    }

    let request = new Request();
    let reviews_list = reviews.reviews_GET(request);
    let filtered = reviews_list.filter(review => {
        return review.submissionID === id;
    });

    let tot = filtered.length;

    if (offset !== undefined) {
        if (!isInteger(offset)) {
            return new Response(400, "Bad offset query");
        }
        if (offset < 0) {
            return new Response(400, "Offset is negative");
        }
        filtered = doOffset(filtered, offset);
    }

    if (limit !== undefined) {
        if (!isInteger(limit)) {
            return new Response(400, "Bad limit query");
        }
        if (limit < 0) {
            return new Response(400, "Limit is negative");
        }
        filtered = doLimit(filtered, limit);
    }

    return new Response(200, { tot_reviews: tot, reviews: filtered });
}




module.exports = {
    submissions_submissionID_review_GET,
    submissions_submissionID_DELETE,
    submissions_submissionID_GET,
    submission_submissionID_PUT,
    submissions_GET,
    submission_POST,
    getByStudentID,
    getByExamID,
    getByTaskID,
};
