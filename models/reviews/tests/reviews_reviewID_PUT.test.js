const util = require('../../utility');
const Request = util.Request;
const Response = util.Response;

const submissions_submissionID_GET = require('../../submissions/submissions_submissionID_GET');
const reviews_reviewID_GET = require('../reviews_reviewID_GET');
const reviews_reviewID_PUT = require('../reviews_reviewID_PUT');
const resetDB = require("../../sampleDB").resetDB;

beforeEach(resetDB);

test("update existing review changing only the mark", () => {
    let req = new Request();
    req.params.reviewID = "4";
    req.body = {
        submissionID: 1,
        studentID: 7,
        mark: 22
    };
    let res = reviews_reviewID_PUT(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(200);
    expect(res.text).toMatch("Review updated");

    // check review in database
    let reqGet = new Request();
    reqGet.params.reviewID = "4";
    let resGet = reviews_reviewID_GET(reqGet);

    expect(resGet).toBeInstanceOf(Response);
    expect(resGet.status).toBe(200);
    expect(resGet.json).toBeDefined();
    expect(resGet.json).toEqual({
        id: 4,
        submissionID: 1,
        studentID: 7,
        mark: 22
    });

    // check submission in database
    let reqGet1 = new Request();
    reqGet1.params.submissionID = "1";
    let resGet1 = submissions_submissionID_GET(reqGet1);

    expect(resGet1).toBeInstanceOf(Response);
    expect(resGet1.status).toBe(200);
    expect(resGet1.json).toBeDefined();
    expect(resGet1.json).toEqual({
        id: 1,
        examID: 1,
        taskID: 2,
        studentID: 3,
        answer: "Asdjka",
        review_points: 22,
        final_points: 0
    });
});

test("update existing review changing mark and studentID", () => {
    let req = new Request();
    req.params.reviewID = "4";
    req.body = {
        submissionID: 1,
        studentID: 2,
        mark: 22
    };
    let res = reviews_reviewID_PUT(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Unique identifiers in your request body differ from existent review");

    // check review in database
    let reqGet = new Request();
    reqGet.params.reviewID = "4";
    let resGet = reviews_reviewID_GET(reqGet);

    expect(resGet).toBeInstanceOf(Response);
    expect(resGet.status).toBe(200);
    expect(resGet.json).toBeDefined();
    expect(resGet.json).toEqual({
        id: 4,
        submissionID: 1,
        studentID: 7,
        mark: 30
    });
});

test("update existing review changing mark and submissionID", () => {
    let req = new Request();
    req.params.reviewID = "4";
    req.body = {
        submissionID: 2,
        studentID: 7,
        mark: 22
    };
    let res = reviews_reviewID_PUT(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Unique identifiers in your request body differ from existent review");

    // check review in database
    let reqGet = new Request();
    reqGet.params.reviewID = "4";
    let resGet = reviews_reviewID_GET(reqGet);

    expect(resGet).toBeInstanceOf(Response);
    expect(resGet.status).toBe(200);
    expect(resGet.json).toBeDefined();
    expect(resGet.json).toEqual({
        id: 4,
        submissionID: 1,
        studentID: 7,
        mark: 30
    });
});

test("create valid review", () => {
    let req = new Request();
    req.params.reviewID = "6";
    req.body = {
        submissionID: 2,
        studentID: 3,
        mark: 0
    };
    let res = reviews_reviewID_PUT(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(201);
    expect(res.text).toMatch("Review created");

    // check review in database
    let reqGet = new Request();
    reqGet.params.reviewID = "6";
    let resGet = reviews_reviewID_GET(reqGet);

    expect(resGet).toBeInstanceOf(Response);
    expect(resGet.status).toBe(200);
    expect(resGet.json).toBeDefined();
    expect(resGet.json).toEqual({
        id: 6,
        submissionID: 2,
        studentID: 3,
        mark: 0
    });
});

test("create non unique review", () => {
    let req = new Request();
    req.params.reviewID = "6";
    req.body = {
        submissionID: 1,
        studentID: 7,
        mark: 0
    };
    let res = reviews_reviewID_PUT(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(423);
    expect(res.text).toMatch("This student has already reviewed that submission");
});

test("update existing review out of deadline", () => {
    let req = new Request();
    req.params.reviewID = "5";
    req.body = {
        submissionID: 4,
        studentID: 1,
        mark: 30
    };
    let res = reviews_reviewID_PUT(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(451);
    expect(res.text).toMatch("Cannot submit the review right now");
});

test("create review for submission in another exam", () => {
    let req = new Request();
    req.params.reviewID = "6";
    req.body = {
        submissionID: 4,
        studentID: 3,
        mark: 0
    };
    let res = reviews_reviewID_PUT(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(424);
    expect(res.text).toMatch("Cannot submit the review: submission not found in the same exam");

    // check review in database
    let reqGet = new Request();
    reqGet.params.reviewID = "4";
    let resGet = reviews_reviewID_GET(reqGet);
});

test("create student reviewing its own submission", () => {
    let req = new Request();
    req.params.reviewID = "6";
    req.body = {
        submissionID: 3,
        studentID: 2,
        mark: 0
    };
    let res = reviews_reviewID_PUT(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("The student can not review its own submission");
});

test("create with not existent studentID", () => {
    let req = new Request();
    req.params.reviewID = "6";
    req.body = {
        submissionID: 3,
        studentID: 4,
        mark: 0
    };
    let res = reviews_reviewID_PUT(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(424);
    expect(res.text).toMatch("StudentID foreign key could not be resolved");
});

test("create with not existent submissionID", () => {
    let req = new Request();
    req.params.reviewID = "6";
    req.body = {
        submissionID: 5,
        studentID: 1,
        mark: 0
    };
    let res = reviews_reviewID_PUT(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(424);
    expect(res.text).toMatch("SubmissionID foreign key could not be resolved");
});

test("with reviewID not an integer", () => {
    let req = new Request();
    req.params.reviewID = "9.2";
    let res = reviews_reviewID_PUT(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("ReviewID is not an integer");
});

test("with reviewID as word", () => {
    let req = new Request();
    req.params.reviewID = "review12";
    let res = reviews_reviewID_PUT(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("ReviewID is not an integer");
});

test("with reviewID = 0", () => {
    let req = new Request();
    req.params.reviewID = "0";
    let res = reviews_reviewID_PUT(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("ReviewID invalid value");
});

test("with mark not an integer", () => {
    let req = new Request();
    req.params.reviewID = "4";
    req.body = {
        submissionID: 1,
        studentID: 7,
        mark: 9.2
    };
    let res = reviews_reviewID_PUT(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Mark is not an integer");
});

test("with mark as word", () => {
    let req = new Request();
    req.params.reviewID = "4";
    req.body = {
        submissionID: 1,
        studentID: 7,
        mark: "ciao"
    };
    let res = reviews_reviewID_PUT(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Mark is not an integer");
});

test("update with mark negative", () => {
    let req = new Request();
    req.params.reviewID = "4";
    req.body = {
        submissionID: 1,
        studentID: 7,
        mark: -1
    };
    let res = reviews_reviewID_PUT(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Mark is out of range");
});

test("update with mark > 30", () => {
    let req = new Request();
    req.params.reviewID = "4";
    req.body = {
        submissionID: 1,
        studentID: 7,
        mark: 33
    };
    let res = reviews_reviewID_PUT(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Mark is out of range");
});


