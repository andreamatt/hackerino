const util = require("../../utility.js");
const Request = util.Request;
const Response = util.Response;

const tasks_taskID_exams_GET = require("../tasks_taskID_exams_GET");
const resetDB = require("../../sampleDB").resetDB;

beforeEach(resetDB);

test("exams of taskID=1", () => {
    let req = new Request();
    req.params.taskID = "1";
    let res = tasks_taskID_exams_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(200);
    expect(res.json).toBeDefined();
    expect(res.json).toEqual({
        tot_exams: 2,
        exams: [
            {
                id: 3,
                date: "December 17, 1995 03:24:00",
                deadline: "December 18, 1995 03:24:00",
                review_deadline: "Tue Dec 10 2050 13:28:55 GMT+0100 (GMT+01:00)",
                tot_students: 0,
                tot_teachers: 3,
                tot_tasks: 4
            },
            {
                id: 4,
                date: "December 17, 1995 03:24:00",
                deadline: "December 18, 1995 03:24:00",
                review_deadline: "Tue Dec 10 2000 13:28:55 GMT+0100 (GMT+01:00)",
                tot_students: 3,
                tot_teachers: 2,
                tot_tasks: 3
            }
        ]
    });
});

test("with limit", () => {
    let req = new Request();
    req.params.taskID = "555";
    req.query.limit = "1";
    let res = tasks_taskID_exams_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(200);
    expect(res.json).toBeDefined();
    expect(res.json).toEqual({
        tot_exams: 2,
        exams: [
            {
                id: 1,
                date: "December 17, 1995 03:24:00",
                deadline: "December 18, 1995 03:24:00",
                review_deadline: "December 18, 2050 03:24:00",
                tot_students: 3,
                tot_teachers: 0,
                tot_tasks: 2
            }
        ]
    });
});

test("with offset", () => {
    let req = new Request();
    req.params.taskID = "2";
    req.query.offset = "2";
    let res = tasks_taskID_exams_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(200);
    expect(res.json).toBeDefined();
    expect(res.json).toEqual({
        tot_exams: 3,
        exams: [
            {
                id: 4,
                date: "December 17, 1995 03:24:00",
                deadline: "December 18, 1995 03:24:00",
                review_deadline: "Tue Dec 10 2000 13:28:55 GMT+0100 (GMT+01:00)",
                tot_students: 3,
                tot_teachers: 2,
                tot_tasks: 3
            }
        ]
    });
});

test("with offset and limit", () => {
    let req = new Request();
    req.params.taskID = "2";
    req.query.offset = "3";
    req.query.limit = "2";
    let res = tasks_taskID_exams_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(200);
    expect(res.json).toBeDefined();
    expect(res.json).toEqual({
        tot_exams: 3,
        exams: []
    });
});

test("non existant taskID=3", () => {
    let req = new Request();
    req.params.taskID = "3";
    let res = tasks_taskID_exams_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(404);
    expect(res.text).toMatch("A task with the specified taskID was not found");
});

test("with id not an integer", () => {
    let req = new Request();
    req.params.taskID = "9.2";
    let res = tasks_taskID_exams_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("TaskID is not an integer");
});

test("with id as word", () => {
    let req = new Request();
    req.params.taskID = "task12";
    let res = tasks_taskID_exams_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("TaskID is not an integer");
});

test("with id=0", () => {
    let req = new Request();
    req.params.taskID = "0";
    let res = tasks_taskID_exams_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("TaskID invalid value");
});

test("with negative limit", () => {
    let req = new Request();
    req.params.taskID = "1";
    req.query.limit = "-2";
    let res = tasks_taskID_exams_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Limit is negative");
});

test("with limit as word", () => {
    let req = new Request();
    req.params.taskID = "1";
    req.query.limit = "notAnumber";
    let res = tasks_taskID_exams_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Limit is not an integer");
});

test("with limit not an integer", () => {
    let req = new Request();
    req.params.taskID = "1";
    req.query.limit = "9.2";
    let res = tasks_taskID_exams_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Limit is not an integer");
});

test("with negative offset", () => {
    let req = new Request();
    req.params.taskID = "1";
    req.query.offset = "-2";
    let res = tasks_taskID_exams_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Offset is negative");
});

test("with offset as a word", () => {
    let req = new Request();
    req.params.taskID = "1";
    req.query.offset = "notAnumber";
    let res = tasks_taskID_exams_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Offset is not an integer");
});

test("with offset not an integer", () => {
    let req = new Request();
    req.params.taskID = "1";
    req.query.offset = "9.2";
    let res = tasks_taskID_exams_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Offset is not an integer");
});

test("with body parameter", () => {
    let req = new Request();
    req.body.id = "10";
    req.params.taskID = "1";
    let res = tasks_taskID_exams_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Request body must be empty");
});
