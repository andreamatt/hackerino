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

    // update condition
    if (id && reviews_list[id]) {
        review.id = id;
    }

    let result = isReview(review);
    if (result === true) {
        reviews_list[review.id] = review;
        return review;
    } else {
        return result;
    }
}

module.exports = { reviews_list, createReview };

