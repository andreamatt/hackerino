const util = require("../../utility.js");
const Request = util.Request;
const Response = util.Response;

const tasks_taskID_GET = require("../tasks_taskID_GET");
const resetDB = require("../../sampleDB").resetDB;

beforeEach(resetDB);

test("with existant id=1", () => {
    let req = new Request();
    req.params.taskID = "1";
    let res = tasks_taskID_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(200);
    expect(res.json).toBeDefined();
    expect(res.json).toEqual({
        id: 1,
        question: "Wut color is dis?",
        answers: {
            possible_answers: ["yes", "i'm blind"],
            correct_answers: [1]
        },
        n_votes: 1324,
        rating: 9.7
    });
});

test("with non existant id=3", () => {
    let req = new Request();
    req.params.taskID = "3";
    let res = tasks_taskID_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(404);
    expect(res.text).toMatch("A task with the specified taskID was not found");
});

test("with existant id=555", () => {
    let req = new Request();
    req.params.taskID = "555";
    let res = tasks_taskID_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(200);
    expect(res.json).toBeDefined();
    expect(res.json).toEqual({
        id: 555,
        question: "Is yoza scarso at dota?",
        answers: {
            possible_answers: ["yes", "sure", "obviously"],
            correct_answers: [0, 1, 2]
        },
        n_votes: 0,
        rating: 0
    });
});

test("with id not an integer", () => {
    let req = new Request();
    req.params.taskID = "9.2";
    let res = tasks_taskID_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("TaskID is not an integer");
});

test("with id as word", () => {
    let req = new Request();
    req.params.taskID = "task12";
    let res = tasks_taskID_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("TaskID is not an integer");
});

test("with id=0", () => {
    let req = new Request();
    req.params.taskID = "0";
    let res = tasks_taskID_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("TaskID invalid value");
});