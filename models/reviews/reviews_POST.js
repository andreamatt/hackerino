const util = require("../utility");
const Request = util.Request;
const Response = util.Response;

//const exams_examID_GET = require("../exams/exams_examID_GET");
//const students_studentID_GET = require("../students/students_studentID_GET");
//const submissions_submissionID_GET = require("../submissions/submissions_submissionID_GET");

const reviews = require("./reviews");
const reviews_list = reviews.reviews_list;

function reviews_POST(req) {
    if (Object.keys(req.body).length > 3) {
        return new Response(400, "Request body has invalid number of properties");
    }

    let studentID = req.body.studentID;
    let submissionID = req.body.submissionID;
    let mark = req.body.mark;

    // check review uniqueness
    let byStudent = Object.values(reviews_list).filter(review => review.studentID === studentID);
    let byStudentAndSubmission = byStudent.filter(review => review.submissionID === submissionID);
    if (byStudentAndSubmission.length > 0) {
        return new Response(423, "This student has already reviewed that submission");
    }

    // check for existing student
    let studentReq = new Request();
    studentReq.params = studentID;
    let studentRes = students_studentID_GET(studentReq);
    if (studentRes.status !== 200) {
        return new Response(424, "StudentID foreign key could not be resolved");
    }

    // check for existing submission
    let submissionReq = new Request();
    submissionReq.params = submissionID;
    let submissionRes = submissions_submissionID_GET(submissionReq);
    if (submissionRes.status !== 200) {
        return new Response(424, "SubmissionID foreign key could not be resolved");
    }

    // check for existing exam
    let examReq = new Request();
    examReq.params = submissionRes.body.exam;
    let examRes = exams_examID_GET(examReq);
    if (examRes.status !== 200) {
        return new Response(424, "Could not find exam associated to given submission");
    }

    // check deadlines
    let deadline = new Date(examRes.body.deadline);
    let review_deadline = new Date(examRes.body.review_deadline);
    let actualTime = new Date();
    if (deadline > actualTime || review_deadline < actualTime) {
        return new Response(451, "Cannot submit the review right now");
    }

    // finally create review
    let result = new createReview(null, studentID, submissionID, mark);
    if (isString(result)) {
        return new Response(400, result);
    }
    return new Response(201, result);
}

module.exports = reviews_POST;