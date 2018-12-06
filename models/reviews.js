
const students = require("./students");
const students_studentID_GET = students.students_studentID_GET;

//const submissions = require("./submissions");
//const submissions_submissionID_GET = submissions.submissions_submissionID_GET;

const exams = require("./exams");
const exams_examID_GET = exams.exams_examID_GET;

const util = require("./utility");
const Request = util.Request;
const Response = util.Response;
const doLimit = util.doLimit;
const doOffset = util.doOffset;
const toInt = util.toInt;
const isReview = util.isReview;
const isInteger = Number.isInteger;

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

function reviews_GET(req) {
    let reviews = Object.values(reviews_list);
    let tot_reviews = reviews.length;

    if (req.query.offset !== undefined) {
        let offset = toInt(req.query.offset);
        if (!isInteger(offset)) {
            return new Response(400, "Offset is not an integer");
        }
        if (offset < 0) {
            return new Response(400, "Offset is negative");
        }
        reviews = doOffset(reviews, offset);
    }
    if (req.query.limit !== undefined) {
        let limit = toInt(req.query.limit);
        if (!isInteger(limit)) {
            return new Response(400, "Limit is not an integer");
        }
        if (limit < 0) {
            return new Response(400, "Limit is negative");
        }
        reviews = doLimit(reviews, limit);
    }
    return new Response(200, { tot_reviews: tot_reviews, reviews: reviews });
}

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

function reviews_reviewID_GET(req) {
    let reviewID = toInt(req.params.reviewID);

    if (!isInteger(reviewID)) {
        return new Response(400, "reviewID is not an integer");
    }
    if (reviewID < 1) {
        return new Response(400, "reviewID invalid value");
    }

    if (!reviews_list[reviewID]) {
        return new Response(404, "A review with the specified reviewID was not found");
    }

    return new Response(200, reviews_list[reviewID]);
}

function reviews_reviewID_PUT(req) {
    if (Object.keys(req.body).length > 3) {
        return new Response(400, "Request body has invalid number of properties");
    }

    let reviewID = toInt(req.params.reviewID);
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

    // finally create/update the review
    let status = reviews_list[reviewID] ? "update" : "create";
    let result = createReview(reviewID, studentID, submissionID, mark);

    if (isString(result)) {
        return new Response(400, result);
    }

    if (status === "update") {
        return new Response(200, "Review updated");
    }
    else {
        return new Response(201, "Review created");
    }
}

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

    delete reviews_list[reviewID];
    return new Response(204, "Review removed");
}

module.exports = { reviews_GET, reviews_POST, reviews_reviewID_GET, reviews_reviewID_PUT, reviews_reviewID_DELETE };

