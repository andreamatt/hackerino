const util = require('../../utility');
const Request = util.Request;
const Response = util.Response;

const reviews_GET = require('../reviews_GET');
const reviews_reviewID_DELETE = require('../reviews_reviewID_DELETE');
const submissions_submissionID_GET = require('../../submissions/submissions_submissionID_GET');
const resetDB = require("../../sampleDB").resetDB;

beforeEach(resetDB);

test("existing review", () => {
    let req = new Request();
    req.params.reviewID = "4";
    let res = reviews_reviewID_DELETE(req);

    expect(res).toBeInstanceOf(Response);
    //expect(res.status).toBe(204);
    expect(res.text).toMatch("Review removed");

    let req1 = new Request();
    let res1 = reviews_GET(req1);

    expect(res1).toBeInstanceOf(Response);
    expect(res1.status).toBe(200);
    expect(res1.json).toBeDefined();
    expect(res1.json).toEqual({
        tot_reviews: 4,
        reviews: [
            {
                id: 1,
                submissionID: 3,
                studentID: 1,
                mark: 29
            },
            {
                id: 2,
                submissionID: 3,
                studentID: 7,
                mark: 27
            },
            {
                id: 3,
                submissionID: 1,
                studentID: 2,
                mark: 0
            },
            {
                id: 5,
                submissionID: 4,
                studentID: 1,
                mark: 23
            }
        ]
    });

    // check if submission review_points is updated
    let req2 = new Request();
    req2.params.submissionID = "1";
    let res2 = submissions_submissionID_GET(req2);

    expect(res2).toBeInstanceOf(Response);
    expect(res2.status).toBe(200);
    expect(res2.json).toBeDefined();
    expect(res2.json).toEqual({
        id: 1,
        examID: 1,
        taskID: 2,
        studentID: 3,
        answer: "Asdjka",
        review_points: 0,
        final_points: 0
    });
});

test("existing review out of deadline", () => {
    let req = new Request();
    req.params.reviewID = "1";
    let res = reviews_reviewID_DELETE(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(451);
    expect(res.text).toMatch("Cannot delete the review right now");
});

test("with non existant id=6", () => {
    let req = new Request();
    req.params.reviewID = "6";
    let res = reviews_reviewID_DELETE(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(404);
    expect(res.text).toMatch("A review with the specified reviewID was not found");
});

test("with id not an integer", () => {
    let req = new Request();
    req.params.reviewID = "9.2";
    let res = reviews_reviewID_DELETE(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("ReviewID is not an integer");
});

test("with id as word", () => {
    let req = new Request();
    req.params.reviewID = "review12";
    let res = reviews_reviewID_DELETE(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("ReviewID is not an integer");
});

test("with id=0", () => {
    let req = new Request();
    req.params.reviewID = "0";
    let res = reviews_reviewID_DELETE(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("ReviewID invalid value");
});