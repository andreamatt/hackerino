const util = require("../../utility.js");
const Request = util.Request;
const Response = util.Response;

const tasks_taskID_GET = require("../tasks_taskID_GET");
const tasks_taskID_vote_POST = require("../tasks_taskID_vote_POST");
const resetDB = require("../../sampleDB").resetDB;

beforeEach(resetDB);

test("with valid votes for existing task without votes", () => {
    let req = new Request();
    req.params.taskID = "555";
    req.body.vote = 9;
    let res = tasks_taskID_vote_POST(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(204);

    // checking for updated rating
    res = tasks_taskID_GET(req);
    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(200);
    expect(res.json).toBeDefined();
    expect(res.json).toMatchObject({
        id: 555,
        question: "Is yoza scarso at dota?",
        answers: {
            possible_answers: ["yes", "sure", "obviously"],
            correct_answers: [0, 1, 2]
        },
        n_votes: 1,
        rating: 9
    });

    // add another vote
    let req2 = new Request();
    req2.params.taskID = "555";
    req2.body.vote = 0;
    let res2 = tasks_taskID_vote_POST(req2);

    expect(res2).toBeInstanceOf(Response);
    expect(res2.status).toBe(204);

    // checking for updated rating
    res2 = tasks_taskID_GET(req2);
    expect(res2).toBeInstanceOf(Response);
    expect(res2.status).toBe(200);
    expect(res2.json).toBeDefined();
    expect(res2.json).toMatchObject({
        id: 555,
        question: "Is yoza scarso at dota?",
        answers: {
            possible_answers: ["yes", "sure", "obviously"],
            correct_answers: [0, 1, 2]
        },
        n_votes: 2,
        rating: 4.5
    });
});

test("with valid vote for non existing task", () => {
    let req = new Request();
    req.params.taskID = "31245";
    req.body.vote = 0;
    let res = tasks_taskID_vote_POST(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(404);
});

test("with vote NaN", () => {
    let req = new Request();
    req.params.taskID = "2";
    req.body.vote = "Africa";
    let res = tasks_taskID_vote_POST(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Vote is not an integer");
});

test("with vote not an integer", () => {
    let req = new Request();
    req.params.taskID = "2";
    req.body.vote = 2.1;
    let res = tasks_taskID_vote_POST(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Vote is not an integer");
});

test("with vote > 10", () => {
    let req = new Request();
    req.params.taskID = "2";
    req.body.vote = 11;
    let res = tasks_taskID_vote_POST(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Vote is out of valid range");
});

test("with vote < 0", () => {
    let req = new Request();
    req.params.taskID = "2";
    req.body.vote = -1;
    let res = tasks_taskID_vote_POST(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Vote is out of valid range");
});

test("update tasks rating many times", () => {
    let req_POST = new Request();
    req_POST.params.taskID = "1";

    // check old average
    let res_GET1 = tasks_taskID_GET(req_POST);
    expect(res_GET1).toBeInstanceOf(Response);
    expect(res_GET1.status).toBe(200);
    expect(res_GET1.json).toBeDefined();
    expect(res_GET1.json).toMatchObject({
        id: 1,
        question: "Wut color is dis?",
        answers: {
            possible_answers: ["yes", "i'm blind"],
            correct_answers: [1]
        },
        n_votes: 1324,
        rating: 9.7
    });
    let rating = res_GET1.json.rating;
    let n_votes = res_GET1.json.n_votes;

    for (let i = 0; i <= 10; i++) {
        // modify average
        req_POST.body.vote = i;
        let res_POST = tasks_taskID_vote_POST(req_POST);
        expect(res_POST).toBeInstanceOf(Response);
        expect(res_POST.status).toBe(204);

        // check new average
        let res_GET2 = tasks_taskID_GET(req_POST);
        expect(res_GET2).toBeInstanceOf(Response);
        expect(res_GET2.status).toBe(200);
        expect(res_GET2.json).toBeDefined();

        rating = (n_votes * rating + i) / (n_votes + 1);
        n_votes++;

        expect(res_GET2.json).toMatchObject({
            id: 1,
            question: "Wut color is dis?",
            answers: {
                possible_answers: ["yes", "i'm blind"],
                correct_answers: [1]
            },
            n_votes: n_votes,
            rating: rating
        });
    }
});

test("with malformed body", () => {
    let req = new Request();
    req.params.taskID = "2";
    req.body.vote = 2;
    req.body.extra = "extra";
    let res = tasks_taskID_vote_POST(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Request body has invalid number of properties");
});

test("with taskID not an integer", () => {
    let req = new Request();
    req.params.taskID = "9.2";
    req.body.vote = 2;
    let res = tasks_taskID_vote_POST(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("TaskID is not an integer");
});

test("with taskID as word", () => {
    let req = new Request();
    req.params.taskID = "two";
    req.body.vote = 2;
    let res = tasks_taskID_vote_POST(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("TaskID is not an integer");
});

test("with invalid taskID", () => {
    let req = new Request();
    req.params.taskID = "0";
    req.body.vote = 2;
    let res = tasks_taskID_vote_POST(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("TaskID invalid value");
});