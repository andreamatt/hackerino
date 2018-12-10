const util = require("../utility");
const Response = util.Response;
const toInt = util.toInt;
const isInteger = util.isInteger;

const reviews = require("./reviews");
const reviews_list = reviews.reviews_list;

const submissions_list = require("../submissions/submissions").submissions_list;
const submissions_submissionID_GET = require("../submissions/submissions_submissionID_GET");
const exams_examID_GET = require("../exams/exams_examID_GET");


function reviews_reviewID_DELETE(req) {
    let reviewID = toInt(req.params.reviewID);
    let submissionID = reviews_list[reviewID].submissionID;

    if (!isInteger(reviewID)) {
        return new Response(400, "ReviewID is not an integer");
    }
    if (reviewID < 1) {
        return new Response(400, "ReviewID invalid value");
    }

    if (!reviews_list[reviewID]) {
        return new Response(404, "A review with the specified reviewID was not found");
    }

    // get submission
    let submissionReq = new Request();
    submissionReq.params.submissionID = submissionID;
    let submissionRes = submissions_submissionID_GET(submissionReq);

    // get exam
    let examReq = new Request();
    examReq.params.examID = submissionRes.body.examID;
    let examRes = exams_examID_GET(examReq);

    // check deadlines
    let deadline = new Date(examRes.body.deadline);
    let review_deadline = new Date(examRes.body.review_deadline);
    let actualTime = new Date();
    if (deadline > actualTime || review_deadline < actualTime) {
        return new Response(451, "Cannot submit the review right now");
    }

    // remove review points from the submission
    submissions_list[submissionID].review_points -= reviews_list[reviewID].mark;

    delete reviews_list[reviewID];
    return new Response(204, "Review removed");
}

module.exports = reviews_reviewID_DELETE;