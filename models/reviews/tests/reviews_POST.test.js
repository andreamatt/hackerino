const util = require('../../utility');
const Request = util.Request;
const Response = util.Response;

const reviews_GET = require('../reviews_GET');
const reviews_POST = require('../reviews_POST');
const resetDB = require("../../sampleDB").resetDB;

beforeEach(resetDB);

function checkReviews(quantity) {
    let req = new Request();
    let res = reviews_GET(req);
    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(200);
    expect(res.json).toBeDefined();
    expect(res.json.tot_reviews).toBe(quantity);
    expect(res.json.reviews).toBeDefined();
    expect(res.json.reviews.length).toBe(quantity);
};

test("valid POST", () => {
    let req = new Request();
    req.body = {
        submissionID: 2,
        studentID: 3,
        mark: 0
    };
    let res = reviews_POST(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(201);
    expect(res.json).toBeDefined();
    expect(res.json).toEqual({
        id: 6,
        submissionID: 2,
        studentID: 3,
        mark: 0
    });
    checkReviews(6);
});

test("with student reviewing an arleady reaviewed submission", () => {
    let req = new Request();
    req.body = {
        submissionID: 3,
        studentID: 1,
        mark: 0
    };
    let res = reviews_POST(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(423);
    expect(res.text).toMatch("This student has already reviewed that submission");
    checkReviews(5);
});

test("with not existent studentID", () => {
    let req = new Request();
    req.body = {
        submissionID: 3,
        studentID: 4,
        mark: 0
    };
    let res = reviews_POST(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(424);
    expect(res.text).toMatch("StudentID foreign key could not be resolved");
    checkReviews(5);
});

test("with not existent submissionID", () => {
    let req = new Request();
    req.body = {
        submissionID: 5,
        studentID: 1,
        mark: 0
    };
    let res = reviews_POST(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(424);
    expect(res.text).toMatch("SubmissionID foreign key could not be resolved");
    checkReviews(5);
});

test("student reviewing its own submission", () => {
    let req = new Request();
    req.body = {
        submissionID: 3,
        studentID: 2,
        mark: 0
    };
    let res = reviews_POST(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("The student can not review its own submission");
    checkReviews(5);
});

test("student reviewing submission of another exam", () => {
    let req = new Request();
    req.body = {
        submissionID: 4,
        studentID: 3,
        mark: 0
    };
    let res = reviews_POST(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(424);
    expect(res.text).toMatch("Cannot submit the review: submission not found in the same exam");
    checkReviews(5);
});

test("student reviewing submission out of deadlines", () => {
    let req = new Request();
    req.body = {
        submissionID: 4,
        studentID: 2,
        mark: 0
    };
    let res = reviews_POST(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(451);
    expect(res.text).toMatch("Cannot submit the review right now");
    checkReviews(5);
});

test("with submissionID not an integer", () => {
    let req = new Request();
    req.body = {
        submissionID: 9.2,
        studentID: 1,
        mark: 0,
    };
    let res = reviews_POST(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("SubmissionID is not an integer");
    checkReviews(5);
});

test("with submissionID as word", () => {
    let req = new Request();
    req.body = {
        submissionID: "ciao",
        studentID: 1,
        mark: 0,
    };
    let res = reviews_POST(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("SubmissionID is not an integer");
    checkReviews(5);
});

test("with submissionID = 0", () => {
    let req = new Request();
    req.body = {
        submissionID: 0,
        studentID: 1,
        mark: 0,
    };
    let res = reviews_POST(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("SubmissionID is not valid integer");
    checkReviews(5);
});

test("with studentID not an integer", () => {
    let req = new Request();
    req.body = {
        submissionID: 1,
        studentID: 9.2,
        mark: 0,
    };
    let res = reviews_POST(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("StudentID is not an integer");
    checkReviews(5);
});

test("with studentID as word", () => {
    let req = new Request();
    req.body = {
        submissionID: 1,
        studentID: "ciao",
        mark: 0,
    };
    let res = reviews_POST(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("StudentID is not an integer");
    checkReviews(5);
});

test("with studentID = 0", () => {
    let req = new Request();
    req.body = {
        submissionID: 1,
        studentID: 0,
        mark: 0,
    };
    let res = reviews_POST(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("StudentID is not valid integer");
    checkReviews(5);
});

test("with mark not an integer", () => {
    let req = new Request();
    req.body = {
        submissionID: 1,
        studentID: 1,
        mark: 9.2,
    };
    let res = reviews_POST(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Mark is not an integer");
    checkReviews(5);
});

test("with mark as word", () => {
    let req = new Request();
    req.body = {
        submissionID: 1,
        studentID: 1,
        mark: "ciao",
    };
    let res = reviews_POST(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Mark is not an integer");
    checkReviews(5);
});

test("with mark negative", () => {
    let req = new Request();
    req.body = {
        submissionID: 1,
        studentID: 1,
        mark: -1,
    };
    let res = reviews_POST(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Mark is out of range");
    checkReviews(5);
});

test("with mark > 30", () => {
    let req = new Request();
    req.body = {
        submissionID: 1,
        studentID: 1,
        mark: 31,
    };
    let res = reviews_POST(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Mark is out of range");
    checkReviews(5);
});


