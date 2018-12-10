const util = require("../../utility.js");
const Request = util.Request;
const Response = util.Response;

const tasks_GET = require("../tasks_GET");
const resetDB = require("../../sampleDB").resetDB;

beforeEach(resetDB);

test("generic", () => {
    let req = new Request();
    let res = tasks_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(200);
    expect(res.json).toEqual({
        tot_tasks: 4,
        tasks: [
            {
                id: 1,
                question: "Wut color is dis?",
                answers: {
                    possible_answers: ["yes", "i'm blind"],
                    correct_answers: [1]
                },
                n_votes: 1324,
                rating: 9.7
            },
            {
                id: 2,
                question: "?",
                n_votes: 28,
                rating: 0
            },
            {
                id: 555,
                question: "Is yoza scarso at dota?",
                answers: {
                    possible_answers: ["yes", "sure", "obviously"],
                    correct_answers: [0, 1, 2]
                },
                n_votes: 0,
                rating: 0
            },
            {
                id: 911,
                question: "Select A and C",
                answers: {
                    possible_answers: ["A", "B", "C", "D"],
                    correct_answers: [0, 2]
                },
                n_votes: 9999999999,
                rating: 10
            }
        ]
    });
});

test("with limit", () => {
    let req = new Request();
    req.query.limit = "2";
    let res = tasks_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(200);
    expect(res.json).toEqual({
        tot_tasks: 4,
        tasks: [
            {
                id: 1,
                question: "Wut color is dis?",
                answers: {
                    possible_answers: ["yes", "i'm blind"],
                    correct_answers: [1]
                },
                n_votes: 1324,
                rating: 9.7
            },
            {
                id: 2,
                question: "?",
                n_votes: 28,
                rating: 0
            }
        ]
    });
});

test("with offset", () => {
    let req = new Request();
    req.query.offset = "3";
    let res = tasks_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(200);
    expect(res.json).toEqual({
        tot_tasks: 4,
        tasks: [
            {
                id: 911,
                question: "Select A and C",
                answers: {
                    possible_answers: ["A", "B", "C", "D"],
                    correct_answers: [0, 2]
                },
                n_votes: 9999999999,
                rating: 10
            }
        ]
    });
});

test("with offset and limit", () => {
    let req = new Request();
    req.query.offset = "2";
    req.query.limit = "1";
    let res = tasks_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(200);
    expect(res.json).toEqual({
        tot_tasks: 4,
        tasks: [
            {
                id: 555,
                question: "Is yoza scarso at dota?",
                answers: {
                    possible_answers: ["yes", "sure", "obviously"],
                    correct_answers: [0, 1, 2]
                },
                n_votes: 0,
                rating: 0
            }
        ]
    });
});

test("with offset over maximum and limit", () => {
    let req = new Request();
    req.query.limit = "1";
    req.query.offset = "10";
    let res = tasks_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(200);
    expect(res.json).toEqual({
        tot_tasks: 4,
        tasks: []
    });
});

test("with negative limit", () => {
    let req = new Request();
    req.query.limit = "-2";
    let res = tasks_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Limit is negative");
});

test("with limit as word", () => {
    let req = new Request();
    req.query.limit = "notAnumber";
    let res = tasks_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Limit is not an integer");
});

test("with limit not an integer", () => {
    let req = new Request();
    req.query.limit = "9.2";
    let res = tasks_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Limit is not an integer");
});

test("with negative offset", () => {
    let req = new Request();
    req.query.offset = "-2";
    let res = tasks_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Offset is negative");
});

test("with offset as a word", () => {
    let req = new Request();
    req.query.offset = "notAnumber";
    let res = tasks_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Offset is not an integer");
});

test("with offset not an integer", () => {
    let req = new Request();
    req.query.offset = "9.2";
    let res = tasks_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Offset is not an integer");
});

test("with body parameter", () => {
    let req = new Request();
    req.body.id = "10";
    let res = tasks_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Request body must be empty");
});