const util = require("../utility");
const Request = util.Request;
const Response = util.Response;
const toInt = util.toInt;

const exams_examID_GET = require("../exams/exams_examID_GET");
const students_studentID_GET = require("../students/students_studentID_GET");
const submissions_submissionID_GET = require("../submissions/submissions_submissionID_GET");
const submissions_list = require("../submissions/submissions").submissions_list;

const reviews = require("./reviews");
const reviews_list = reviews.reviews_list;

function reviews_reviewID_PUT(req) {
    if (Object.keys(req.body).length > 3) {
        return new Response(400, "Request body has invalid number of properties");
    }

    let studentID = req.body.studentID;
    let submissionID = req.body.submissionID;
    let mark = req.body.mark;

    let reviewID = toInt(req.params.reviewID);
    if (!isInteger(reviewID)) {
        return new Response(400, "reviewID is not an integer");
    }
    if (reviewID < 1) {
        return new Response(400, "reviewID invalid value");
    }

    // check review uniqueness
    if (reviews.isUnique(studentID, submissionID) === false) {
        return new Response(423, "This student has already reviewed that submission");
    }

    // check for existing student
    let studentReq = new Request();
    studentReq.params.studentID = studentID;
    let studentRes = students_studentID_GET(studentReq);
    if (studentRes.status !== 200) {
        return new Response(424, "StudentID foreign key could not be resolved");
    }

    // check for existing submission
    let submissionReq = new Request();
    submissionReq.params.submissionID = submissionID;
    let submissionRes = submissions_submissionID_GET(submissionReq);
    if (submissionRes.status !== 200) {
        return new Response(424, "SubmissionID foreign key could not be resolved");
    }

    // check if student is reviewer of its own submission
    let refStudID = submissionRes.body.studentID;
    if (studentID === refStudID) {
        return new Response(400, "The student can not review its own submission");
    }

    // check for existing exam
    let examReq = new Request();
    examReq.params.examID = submissionRes.body.examID;
    let examRes = exams_examID_GET(examReq);
    if (examRes.status !== 200) {
        return new Response(424, "Could not find exam associated to given submission");
    }

    // check that the student is in the same exam of the submission he is reviewing 
    if (!examRes.body.students[studentID]) {
        return new Response(424, "Cannot submit the review: submission not found in the same exam");
    }

    // check deadlines
    let deadline = new Date(examRes.body.deadline);
    let review_deadline = new Date(examRes.body.review_deadline);
    let actualTime = new Date();
    if (deadline > actualTime || review_deadline < actualTime) {
        return new Response(451, "Cannot submit the review right now: too early or too late");
    }

    // finally create/update the review
    let status = reviews_list[reviewID] ? "update" : "create";
    let oldMark;
    if (status === "update") {
        oldMark = reviews_list[reviewID].mark;
    }
    let result = createReview(reviewID, studentID, submissionID, mark);

    if (isString(result)) {
        return new Response(400, result);
    }

    if (status === "update") {
        // update submission points from peer-reviews
        submissions_list[submissionID].review_points -= oldMark;
        submissions_list[submissionID].review_points += mark;
        return new Response(200, "Review updated");
    }
    else {
        // add review points to the submission
        submissions_list[submissionID].review_points += mark;
        return new Response(201, "Review created");
    }
}

module.exports = reviews_reviewID_PUT;
