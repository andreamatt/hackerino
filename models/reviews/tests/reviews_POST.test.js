const util = require('../../utility');
const Request = util.Request;
const Response = util.Response;
const isReview = util.isReview;

const reviews_POST = require('../reviews_POST');

test("empty", () => {

});

/*
test("valid post", () => {
    let req = new Request();
    req.body = {
        studentID: 1,
        submissionID: 1,
        mark: 29
    };
    let res = reviews_POST(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(201);
    expect(res.json).toBeDefined();
});
*/