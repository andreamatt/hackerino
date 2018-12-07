const util = require('../../utility');
const Request = util.Request;
const Response = util.Response;
const isReview = util.isReview;

const reviews_GET = require('../reviews_GET');

test("generic reviews_GET", () => {
    let req = new Request();
    let res = reviews_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(200);
    expect(res.json).toBeDefined();
    expect(res.json.tot_reviews).toBeGreaterThanOrEqual(0);
    expect(res.json.reviews).toBeDefined();
    res.json.reviews.every(review => {
        expect(isReview(review)).toBe(true);
    });
});

test("with limit", () => {
    let req = new Request();
    req.query.limit = "4";
    let res = reviews_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(200);
    expect(res.json).toBeDefined();
    expect(res.json.tot_reviews).toBeGreaterThanOrEqual(0);
    expect(res.json.reviews).toBeDefined();
    expect(res.json.reviews.length).toBeLessThanOrEqual(4);
    res.json.reviews.every(review => {
        expect(isReview(review)).toBe(true);
    });
});

test("with limit < 0", () => {
    let req = new Request();
    req.query.limit = "-10";
    let res = reviews_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Limit is negative");
});

test("with limit not a random word", () => {
    let req = new Request();
    req.query.limit = "integer";
    let res = reviews_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Limit is not an integer");
});

test("with limit not an integer", () => {
    let req = new Request();
    req.query.limit = "-3.9";
    let res = reviews_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Limit is not an integer");
});

test("with offset", () => {
    let req = new Request();
    req.query.offset = "4";
    let res = reviews_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(200);
    expect(res.json).toBeDefined();
    expect(res.json.tot_reviews).toBeGreaterThanOrEqual(0);
    expect(res.json.reviews).toBeDefined();
    expect(res.json.reviews.length).toBeLessThanOrEqual(4);
    res.json.reviews.every(review => {
        expect(isReview(review)).toBe(true);
    });
});

test("with offset < 0", () => {
    let req = new Request();
    req.query.offset = "-1";
    let res = reviews_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Offset is negative");
});

test("with offset not an integer", () => {
    let req = new Request();
    req.query.offset = "Four";
    let res = reviews_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Offset is not an integer");
});

test("with offset and limit", () => {
    let req = new Request();
    req.query.offset = "1";
    req.query.limit = "10";
    let res = reviews_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(200);
    expect(res.json).toBeDefined();
    expect(res.json.tot_reviews).toBeGreaterThanOrEqual(0);
    expect(res.json.reviews).toBeDefined();
    res.json.reviews.every(review => {
        expect(isreview(review)).toBe(true);
    });
});