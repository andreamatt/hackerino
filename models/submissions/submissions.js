const util = require('../utility');
const isString = util.isString;
const isSubmission = util.isSubmission;

const submissions_list = {};

function Submission(student, exam, task, answer, chosen_answer) {
    this.id = 1;
    while (submissions_list[this.id]) {
        this.id++;
    }

    this.studentID = student;
    this.examID = exam;
    this.taskID = task;
    this.answer = answer;
    this.chosen_answer = chosen_answer;
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



module.exports = {
    create_submission,
    submissions_list,
    getByStudentID,
    getByExamID,
    getByTaskID,
};