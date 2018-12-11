const util = require('../utility');
const forceDelete_review = require('../reviews/reviews').forceDelete_review;
const reviews_GET = require('../reviews/reviews_GET');
const isSubmission = util.isSubmission;
const isString = util.isString;
const Request = util.Request;

const submissions_list = {
    /*
    1: {
        "id": 1,
        "studentID": 9,
        "taskID": 2,
        "examID": 13,
        "chosen_answers": [
          1
        ],
        "review_points": 0,
        "final_points": 0
    }
    */
};

function Submission(student, exam, task, answer, chosen_answers) {
    this.id = 1;
    while (submissions_list[this.id]) {
        this.id++;
    }

    this.studentID = student;
    this.examID = exam;
    this.taskID = task;
    this.answer = answer;
    this.chosen_answers = chosen_answers;
    this.review_points = 0;
    this.final_points = 0;
}

function create_submission(id, studentID, examID, taskID, answer, chosen_answers) {
    let sub = new Submission(studentID, examID, taskID, answer, chosen_answers);
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

function forceDelete_submission(id) {
    if (submissions_list[id]) {
        let request = new Request();
        let reviews_list = reviews_GET(request).json.reviews;
        let filtered = reviews_list.filter(rev => rev.submissionID === id);
        for (rev of filtered) {
            forceDelete_review(rev.id);
        }

        delete submissions_list[id];
    } else {
        throw new Error("submission not existing");
    }
}

module.exports = {
    forceDelete_submission,
    create_submission,
    submissions_list,
    getByStudentID,
    getByExamID,
    getByTaskID,
};