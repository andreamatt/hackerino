const util = require("../../utility.js");
const Request = util.Request;
const Response = util.Response;

const tasks_taskID_submissions_GET = require("../tasks_taskID_submissions_GET");
const resetDB = require("../../sampleDB").resetDB;

beforeEach(resetDB);

test("submissions of taskID=1", () => {
    let req = new Request();
    req.params.taskID = "1";
    let res = tasks_taskID_submissions_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(200);
    expect(res.json).toBeDefined();
    expect(res.json).toEqual({
        tot_submissions: 2,
        submissions: [
            {
                id: 3,
                examID: 4,
                taskID: 1,
                studentID: 2,
                chosen_answers: [1],
                review_points: 29 + 27,
                final_points: 0
            },
            {
                id: 4,
                examID: 4,
                taskID: 1,
                studentID: 7,
                chosen_answers: [0],
                review_points: 23,
                final_points: 0
            }
        ]
    });
});

test("submissions of taskID=2", () => {
    let req = new Request();
    req.params.taskID = "2";
    let res = tasks_taskID_submissions_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(200);
    expect(res.json).toBeDefined();
    expect(res.json).toEqual({
        tot_submissions: 2,
        submissions: [
            {
                id: 1,
                examID: 1,
                taskID: 2,
                studentID: 3,
                answer: "Asdjka",
                review_points: 0 + 30,
                final_points: 0
            },
            {
                id: 2,
                examID: 1,
                taskID: 2,
                studentID: 7,
                answer: "dsjaklj",
                review_points: 0,
                final_points: 0
            }
        ]
    });
});

test("non existant taskID=3", () => {
    let req = new Request();
    req.params.taskID = "3";
    let res = tasks_taskID_submissions_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(404);
    expect(res.text).toMatch("A task with the specified taskID was not found");
});

test("with id not an integer", () => {
    let req = new Request();
    req.params.taskID = "9.2";
    let res = tasks_taskID_submissions_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("TaskID is not an integer");
});

test("with id as word", () => {
    let req = new Request();
    req.params.taskID = "task12";
    let res = tasks_taskID_submissions_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("TaskID is not an integer");
});

test("with id=0", () => {
    let req = new Request();
    req.params.taskID = "0";
    let res = tasks_taskID_submissions_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("TaskID invalid value");
});

test("with limit", () => {
    let req = new Request();
    req.params.taskID = "1";
    req.query.limit = "1";
    let res = tasks_taskID_submissions_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(200);
    expect(res.json).toBeDefined();
    expect(res.json).toEqual({
        tot_submissions: 2,
        submissions: [
            {
                id: 3,
                examID: 4,
                taskID: 1,
                studentID: 2,
                chosen_answers: [1],
                review_points: 29 + 27,
                final_points: 0
            }
        ]
    });
});

test("with offset", () => {
    let req = new Request();
    req.params.taskID = "1";
    req.query.offset = "1";
    let res = tasks_taskID_submissions_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(200);
    expect(res.json).toBeDefined();
    expect(res.json).toEqual({
        tot_submissions: 2,
        submissions: [
            {
                id: 4,
                examID: 4,
                taskID: 1,
                studentID: 7,
                chosen_answers: [0],
                review_points: 23,
                final_points: 0
            }
        ]
    });
});

test("with offset and limit", () => {
    let req = new Request();
    req.params.taskID = "1";
    req.query.offset = "1";
    req.query.limit = "0";
    let res = tasks_taskID_submissions_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(200);
    expect(res.json).toBeDefined();
    expect(res.json).toEqual({
        tot_submissions: 2,
        submissions: []
    });
});

test("with negative limit", () => {
    let req = new Request();
    req.params.taskID = "1";
    req.query.limit = "-2";
    let res = tasks_taskID_submissions_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Limit is negative");
});

test("with limit as word", () => {
    let req = new Request();
    req.params.taskID = "1";
    req.query.limit = "notAnumber";
    let res = tasks_taskID_submissions_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Limit is not an integer");
});

test("with limit not an integer", () => {
    let req = new Request();
    req.params.taskID = "1";
    req.query.limit = "9.2";
    let res = tasks_taskID_submissions_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Limit is not an integer");
});

test("with negative offset", () => {
    let req = new Request();
    req.params.taskID = "1";
    req.query.offset = "-2";
    let res = tasks_taskID_submissions_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Offset is negative");
});

test("with offset as a word", () => {
    let req = new Request();
    req.params.taskID = "1";
    req.query.offset = "notAnumber";
    let res = tasks_taskID_submissions_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Offset is not an integer");
});

test("with offset not an integer", () => {
    let req = new Request();
    req.params.taskID = "1";
    req.query.offset = "9.2";
    let res = tasks_taskID_submissions_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Offset is not an integer");
});

test("with body parameter", () => {
    let req = new Request();
    req.body.id = "10";
    req.params.taskID = "1";
    let res = tasks_taskID_submissions_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Request body must be empty");
});


