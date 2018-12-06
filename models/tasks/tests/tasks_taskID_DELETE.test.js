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

beforeAll(() => {
    // populate
    for (let i = 1; i < 60; i++) {
        let postReq = new Request();
        postReq.body = {
            question: "Tell me about those " + i
        };
        tasks_POST(postReq);
    }
});

test("existing task", () => {
    let req = new Request();
    req.params.taskID = "50";
    let res = tasks_taskID_DELETE(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(204);
    expect(res.text).toMatch("Task removed");
});

test("non existing task", () => {
    let req = new Request();
    req.params.taskID = "24998850";
    let res = tasks_taskID_DELETE(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(404);
    expect(res.text).toMatch("A task with the specified taskID was not found");
});

test("with taskID=0", () => {
    let req = new Request();
    req.params.taskID = "0";
    let res = tasks_taskID_DELETE(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("TaskID invalid value");
});

test("with taskID not an integer", () => {
    let req = new Request();
    req.params.taskID = "three";
    let res = tasks_taskID_DELETE(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("TaskID is not an integer");
});