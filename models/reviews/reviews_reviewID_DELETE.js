const util = require("../utility");
const Request = util.Request;
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
    
    if (!isInteger(reviewID)) {
        return new Response(400, "ReviewID is not an integer");
    }
    if (reviewID < 1) {
        return new Response(400, "ReviewID invalid value");
    }
    
    if (!reviews_list[reviewID]) {
        return new Response(404, "A review with the specified reviewID was not found");
    }
    let submissionID = reviews_list[reviewID].submissionID;

    // get submission
    let submissionReq = new Request();
    submissionReq.params.submissionID = submissionID;
    let submissionRes = submissions_submissionID_GET(submissionReq);

    // check deadlines
    let examsReq = new Request();
    examsReq.params.examID = submissionRes.json.examID;
    let examsRes = exams_examID_GET(examsReq);

    let deadline = new Date(examsRes.json.deadline);
    let review_deadline = new Date(examsRes.json.review_deadline);
    let actualTime = new Date();

    if (deadline > actualTime || review_deadline < actualTime) {
        return new Response(451, "Cannot delete the review right now");
    }

    // remove review points from the submission
    submissions_list[submissionID].review_points -= reviews_list[reviewID].mark;

    delete reviews_list[reviewID];
    return new Response(204, "Review removed");
}

module.exports = reviews_reviewID_DELETE;