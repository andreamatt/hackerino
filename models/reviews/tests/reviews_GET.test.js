const util = require('../../utility');
const Request = util.Request;
const Response = util.Response;

const reviews_GET = require('../reviews_GET');
const resetDB = require("../../sampleDB").resetDB;

beforeEach(resetDB);

test("generic", () => {
    let req = new Request();
    let res = reviews_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(200);
    expect(res.json).toEqual({
        tot_reviews: 5,
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
                id: 4,
                submissionID: 1,
                studentID: 7,
                mark: 30
            },
            {
                id: 5,
                submissionID: 4,
                studentID: 1,
                mark: 23
            }
        ]
    });
});

test("with limit", () => {
    let req = new Request();
    req.query.limit = "2";
    let res = reviews_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(200);
    expect(res.json).toEqual({
        tot_reviews: 5,
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
            }
        ]
    });
});

test("with offset", () => {
    let req = new Request();
    req.query.offset = "3";
    let res = reviews_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(200);
    expect(res.json).toEqual({
        tot_reviews: 5,
        reviews: [
            {
                id: 4,
                submissionID: 1,
                studentID: 7,
                mark: 30
            },
            {
                id: 5,
                submissionID: 4,
                studentID: 1,
                mark: 23
            }
        ]
    });
});


test("with offset and limit", () => {
    let req = new Request();
    req.query.offset = "2";
    req.query.limit = "2";
    let res = reviews_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(200);
    expect(res.json).toEqual({
        tot_reviews: 5,
        reviews: [
            {
                id: 3,
                submissionID: 1,
                studentID: 2,
                mark: 0
            },
            {
                id: 4,
                submissionID: 1,
                studentID: 7,
                mark: 30
            }
        ]
    });
});

test("with offset over maximum and limit", () => {
    let req = new Request();
    req.query.limit = "1";
    req.query.offset = "10";
    let res = reviews_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(200);
    expect(res.json).toEqual({
        tot_reviews: 5,
        reviews: []
    });
});

test("with negative limit", () => {
    let req = new Request();
    req.query.limit = "-2";
    let res = reviews_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Limit is negative");
});

test("with limit as word", () => {
    let req = new Request();
    req.query.limit = "notAnumber";
    let res = reviews_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Limit is not an integer");
});

test("with limit not an integer", () => {
    let req = new Request();
    req.query.limit = "9.2";
    let res = reviews_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Limit is not an integer");
});

test("with negative offset", () => {
    let req = new Request();
    req.query.offset = "-2";
    let res = reviews_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Offset is negative");
});

test("with offset as a word", () => {
    let req = new Request();
    req.query.offset = "notAnumber";
    let res = reviews_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Offset is not an integer");
});

test("with offset not an integer", () => {
    let req = new Request();
    req.query.offset = "9.2";
    let res = reviews_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Offset is not an integer");
});