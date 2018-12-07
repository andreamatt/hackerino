const util = require("../../utility.js");
const Request = util.Request;
const Response = util.Response;
const isTask = util.isTask;

const tasks_POST = require("../tasks_POST");
const tasks_taskID_GET = require("../tasks_taskID_GET");

beforeAll(() => {
    // populate
    for (let i = 1; i < 100; i++) {
        let postReq = new Request();
        postReq.body = {
            question: "Tell me about those " + i
        };
        tasks_POST(postReq);
    }
});

test("with id=1", () => {
    // find that task
    let req = new Request();
    req.params.taskID = "1";
    let res = tasks_taskID_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(200);
    expect(res.json).toBeDefined();
    expect(isTask(res.json)).toBe(true);
    expect(res.json.id).toBe(Number(req.params.taskID));
});

test("with non existant id", () => {
    let req = new Request();
    req.params.taskID = "12345678";
    let res = tasks_taskID_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(404);
    expect(res.text).toMatch("A task with the specified taskID was not found");
});

test("with id=50", () => {
    let req = new Request();
    req.params.taskID = "50";
    let res = tasks_taskID_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(200);
    expect(res.json).toBeDefined();
    expect(isTask(res.json)).toBe(true);
    expect(res.json.id).toBe(Number(req.params.taskID));
});

test("with id not an integer", () => {
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