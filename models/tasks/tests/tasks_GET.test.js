const util = require("../../utility.js");
const Request = util.Request;
const Response = util.Response;
const isTask = util.isTask;

const tasks_GET = require("../tasks_GET");
const tasks_POST = require("../tasks_POST");
const tasks_taskID_GET = require("../tasks_taskID_GET");
const tasks_taskID_PUT = require("../tasks_taskID_PUT");
const tasks_taskID_DELETE = require("../tasks_taskID_DELETE");
const tasks_taskID_vote_POST = require("../tasks_taskID_vote_POST");

test("generic tasks_GET", () => {
    let req = new Request();
    let res = tasks_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(200);
    expect(res.json).toBeDefined();
    expect(res.json.tot_tasks).toBeGreaterThanOrEqual(0);
    expect(res.json.tasks).toBeDefined();
    res.json.tasks.every(task => {
        expect(isTask(task)).toBe(true);
    });
});

test("with limit and empty tasks_list", () => {
    let req = new Request();
    let res = tasks_GET(req);
    req.query.limit = "10";

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(200);
    expect(res.json).toBeDefined();
    expect(res.json.tot_tasks).toBeGreaterThanOrEqual(0);
    expect(res.json.tasks).toBeDefined();
    expect(res.json.tasks.length).toBe(0);
    res.json.tasks.every(task => {
        expect(isTask(task)).toBe(true);
    });
});

test("with offset", () => {
    let req = new Request();
    let res = tasks_GET(req);
    req.query.offset = "0";

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(200);
    expect(res.json).toBeDefined();
    expect(res.json.tot_tasks).toBeGreaterThanOrEqual(0);
    expect(res.json.tasks).toBeDefined();
    res.json.tasks.every(task => {
        expect(isTask(task)).toBe(true);
    });
});

test("with offset and limit", () => {
    let req = new Request();
    req.query.offset = "1";
    req.query.limit = "10";
    let res = tasks_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(200);
    expect(res.json).toBeDefined();
    expect(res.json.tot_tasks).toBeGreaterThanOrEqual(0);
    expect(res.json.tasks).toBeDefined();
    res.json.tasks.every(task => {
        expect(isTask(task)).toBe(true);
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

test("with limit not an integer", () => {
    let req = new Request();
    req.query.limit = "notAnumber";
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

test("with offset not an integer", () => {
    let req = new Request();
    req.query.offset = "notAnumber";
    let res = tasks_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Offset is not an integer");
});