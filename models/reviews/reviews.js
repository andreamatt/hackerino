const util = require("../utility");
const isReview = util.isReview;

const reviews_list = {
    /*
    1: {
        id: 1,
        student: 1,
        submission: 1,
        mark: 29
    }
    */
};

function Review(studentID, submissionID, mark) {
    let id = 1;
    while (reviews_list[id]) {
        id++;
    }

    this.id = id;
    this.studentID = studentID;
    this.submissionID = submissionID;
    this.mark = mark;
}

function createReview(id, studentID, submissionID, mark) {
    let review = new Review(studentID, submissionID, mark);

    // update mode
    if (id && reviews_list[id]) {
        if (review.studentID === studentID && review.submissionID === submissionID) {
            review.id = id;
        } else {
            return "Unique identifiers in your request body differ from existent review";
        }
    }

    let result = isReview(review);
    if (result === true) {
        reviews_list[review.id] = review;
        return review;
    } else {
        return result;
    }
}

function isUnique(studentID, submissionID) {
    let byStudentAndSubmission = Object.values(reviews_list)
        .filter(review => review.studentID === studentID && review.submissionID === submissionID);

    let result = (byStudentAndSubmission.length === 0) ? true : false;
    return result;
}

function forceDelete_review(id) {
    if (reviews_list[id]) {
        delete reviews_list[id];
    } else {
        throw new Error("submission not existing");
    }
}

module.exports = { reviews_list, createReview, isUnique, forceDelete_review };

