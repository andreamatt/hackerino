const util = require("../utility");
const Request = util.Request;
const Response = util.Response;
const isInteger = util.isInteger;
const toInt = util.toInt;
const isString = util.isString;

const createReview = require("./reviews").createReview;
const exams_examID_GET = require("../exams/exams_examID_GET");
const exams_examID_students_GET = require("../exams/exams_examID_students_GET");
const students_studentID_GET = require("../students/students_studentID_GET");
const submissions_submissionID_GET = require("../submissions/submissions_submissionID_GET");
const submissions_list = require("../submissions/submissions").submissions_list;

const reviews = require("./reviews");
const reviews_list = reviews.reviews_list;

function reviews_reviewID_PUT(req) {
    let studentID = req.body.studentID;
    let submissionID = req.body.submissionID;
    let mark = req.body.mark;
    let reviewID = toInt(req.params.reviewID);

    if (!isInteger(reviewID)) {
        return new Response(400, "ReviewID is not an integer");
    }
    if (reviewID < 1) {
        return new Response(400, "ReviewID invalid value");
    }

    // try to create the review
    let result = createReview(reviewID, studentID, submissionID, mark);
    if (isString(result)) {
        return new Response(400, result);
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
    let refStudID = submissionRes.json.studentID;
    if (studentID === refStudID) {
        return new Response(400, "The student can not review its own submission");
    }

    // check for existing exam
    let examStudentsReq = new Request();
    examStudentsReq.params.examID = submissionRes.json.examID;
    let examStudentsRes = exams_examID_students_GET(examStudentsReq);

    // check that the student is in the same exam of the submission he is reviewing 
    if (examStudentsRes.json.students.filter(student => student.id === studentID).length === 0) {
        return new Response(424, "Cannot submit the review: submission not found in the same exam");
    }

    // check deadlines
    let examsReq = new Request();
    examsReq.params.examID = submissionRes.json.examID;
    let examsRes = exams_examID_GET(examsReq);

    let deadline = new Date(examsRes.json.deadline);
    let review_deadline = new Date(examsRes.json.review_deadline);
    let actualTime = new Date();

    if (deadline > actualTime || review_deadline < actualTime) {
        return new Response(451, "Cannot submit the review right now");
    }

    // finally create/update the review
    let status = reviews_list[reviewID] ? "update" : "create";
    let oldMark;
    if (status === "update") {
        oldMark = reviews_list[reviewID].mark;
    }

    if (status === "update") {
        // update submission points from peer-reviews
        submissions_list[submissionID].review_points -= oldMark;
        submissions_list[submissionID].review_points += mark;

        reviews_list[result.id] = result;
        return new Response(200, "Review updated");
    }
    else { // create
        // check review uniqueness
        if (reviews.isUnique(studentID, submissionID) === false) {
            return new Response(423, "This student has already reviewed that submission");
        }

        // add review points to the submission
        reviews_list[result.id] = result;
        submissions_list[submissionID].review_points += mark;
        return new Response(201, "Review created");
    }
}

module.exports = reviews_reviewID_PUT;
