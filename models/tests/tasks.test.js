const util = require("../utility.js");
const Request = util.Request;
const Response = util.Response;
const isTask = util.isTask;

const tasks = require("../tasks.js");
const tasks_GET = tasks.tasks_GET;



test("tasks_GET", () => {
    let req = new Request();
    let res = tasks_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(200);
    expect(res.text).toBeNull();
    expect(res.json).toBeDefined();
    expect(res.json.tot_tasks).toBeGreaterThanOrEqual(0);
    res.json.tasks.every(task => {
        expect(isTask(task)).toBe(true);
    });
});

test("tasks_GET with limit", () => {
    let req = new Request();
    let res = tasks_GET(req);
    req.query.limit = 10;

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(200);
    expect(res.text).toBeNull();
    expect(res.json).toBeDefined();
    expect(res.json.tot_tasks).toBeGreaterThanOrEqual(0);
    res.json.tasks.every(task => {
        expect(isTask(task)).toBe(true);
    });
});

test("tasks_GET with offset", () => {
    let req = new Request();
    let res = tasks_GET(req);
    req.query.offset = 0;

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(200);
    expect(res.text).toBeNull();
    expect(res.json).toBeDefined();
    expect(res.json.tot_tasks).toBeGreaterThanOrEqual(0);
    res.json.tasks.every(task => {
        expect(isTask(task)).toBe(true);
    });
});

test("tasks_GET with offset and limit", () => {
    let req = new Request();
    req.query.offset = 1;
    req.query.limit = 10;
    let res = tasks_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(200);
    expect(res.text).toBeNull();
    expect(res.json).toBeDefined();
    expect(res.json.tot_tasks).toBeGreaterThanOrEqual(0);
    res.json.tasks.every(task => {
        expect(isTask(task)).toBe(true);
    });
});

test("tasks_GET with negative limit", () => {
    let req = new Request();
    req.query.limit = -2;
    let res = tasks_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("limit is negative");
    expect(res.json).toBeNull();
});

test("tasks_GET with limit Nan", () => {
    let req = new Request();
    req.query.limit = "10";
    let res = tasks_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("limit is NaN");
    expect(res.json).toBeNull();
});

test("tasks_GET with negative offset", () => {
    let req = new Request();
    req.query.offset = -2;
    let res = tasks_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("offset is negative");
    expect(res.json).toBeNull();
});

test("tasks_GET with offset Nan", () => {
    let req = new Request();
    req.query.offset = "10";
    let res = tasks_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("offset is NaN");
    expect(res.json).toBeNull();
});

