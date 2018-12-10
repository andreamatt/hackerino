const util = require('../utility');
const rev = require('../reviews/reviews');
const sub_subID_rev_get = require('./submissions_submissionID_reviews_GET');
const submissions_submissionID_reviews_GET = sub_subID_rev_get.submissions_submissionID_reviews_GET;
const forceDelete_review = rev.forceDelete_review;
const isSubmission = util.isSubmission;
const isString = util.isString;


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
        delete submissions_list[id];

        let request = new Request();
        request.params.id = id;
        let reviews_list = submissions_submissionID_reviews_GET(request).json.reviews;

        for (let entry in reviews_list) {
            forceDelete_review(entry.id);
        }
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