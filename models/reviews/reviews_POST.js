const util = require("../utility");
const Request = util.Request;
const Response = util.Response;

const exams_examID_GET = require("../exams/exams_examID_GET");
const students_studentID_GET = require("../students/students_studentID_GET");
const submissions_submissionID_GET = require("../submissions/submissions_submissionID_GET");
const submissions_list = require("../submissions/submissions").submissions_list;

const reviews = require("./reviews");

function reviews_POST(req) {
    if (Object.keys(req.body).length > 3) {
        return new Response(400, "Request body has invalid number of properties");
    }

    let studentID = req.body.studentID;
    let submissionID = req.body.submissionID;
    let mark = req.body.mark;

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
        return new Response(451, "Cannot submit the review right now");
    }

    // finally try to create the review
    let result = new createReview(null, studentID, submissionID, mark);
    if (isString(result)) {
        return new Response(400, result);
    }
    // add review points to the submission
    submissions_list[submissionID].review_points += mark;
    return new Response(201, result);
}

module.exports = reviews_POST;