const util = require('../../utility');
const Request = util.Request;
const Response = util.Response;

const reviews_reviewID_GET = require('../reviews_reviewID_GET');
const resetDB = require("../../sampleDB").resetDB;

beforeEach(resetDB);

test("with existant id=1", () => {
    let req = new Request();
    req.params.reviewID = "1";
    let res = reviews_reviewID_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(200);
    expect(res.json).toBeDefined();
    expect(res.json).toEqual({
        id: 1,
		submissionID: 3,
		studentID: 1,
		mark: 29
    });
});

test("with non existant id=6", () => {
    let req = new Request();
    req.params.reviewID = "6";
    let res = reviews_reviewID_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(404);
    expect(res.text).toMatch("A review with the specified reviewID was not found");
});

test("with id not an integer", () => {
    let req = new Request();
    req.params.reviewID = "9.2";
    let res = reviews_reviewID_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("ReviewID is not an integer");
});

test("with id as word", () => {
    let req = new Request();
    req.params.reviewID = "review12";
    let res = reviews_reviewID_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("ReviewID is not an integer");
});

test("with id=0", () => {
    let req = new Request();
    req.params.reviewID = "0";
    let res = reviews_reviewID_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("ReviewID invalid value");
});