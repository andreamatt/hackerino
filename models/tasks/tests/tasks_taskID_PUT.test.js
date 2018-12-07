const util = require("../../utility.js");
const Request = util.Request;
const Response = util.Response;
const isTask = util.isTask;

const tasks_POST = require("../tasks_POST");
const tasks_taskID_PUT = require("../tasks_taskID_PUT");

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

test("tasks_taskID_PUT, update existing task", () => {
    let req = new Request();
    req.params.taskID = "50";
    req.body = {
        question: "Who is bigger?",
        answers: {
            possible_answers: ["Elyon", "Jhw"],
            correct_answers: [0]
        }
    };
    let res = tasks_taskID_PUT(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(200);
    expect(res.text).toMatch("Task updated");
});

test("tasks_taskID_PUT, update existing task with existing question", () => {
    let req = new Request();
    req.params.taskID = "2";
    req.body = {
        question: "Who is bigger?",
        answers: {
            possible_answers: ["Elyon", "Jhw", "Holla"],
            correct_answers: [0]
        }
    };
    let res = tasks_taskID_PUT(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(423);
    expect(res.text).toMatch("A task with such question already exists");
});

test("tasks_taskID_PUT, create task", () => {
    let req = new Request();
    req.params.taskID = "9999123";
    req.body = {
        question: "Who is smaller?",
        answers: {
            possible_answers: ["Elyon", "Jhw"],
            correct_answers: [0]
        }
    };
    let res = tasks_taskID_PUT(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(201);
    expect(res.text).toMatch("Task created");
});

test("tasks_taskID_PUT, create task with existing question", () => {
    let req = new Request();
    req.params.taskID = "9999124";
    req.body = {
        question: "Who is smaller?",
        answers: {
            possible_answers: ["Enoch", "Elyon", "Jhw"],
            correct_answers: [0]
        }
    };
    let res = tasks_taskID_PUT(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(423);
    expect(res.text).toMatch("A task with such question already exists");
});

test("with malformed request", () => {
    let req = new Request();
    req.params.taskID = "23";
    req.body = {
        question: "What is the reason of this?",
        answers: {
            possible_answers: "Elyon",
            correct_answers: [99]
        }
    };
    let res = tasks_taskID_PUT(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
});

test("with taskID=0", () => {
    let req = new Request();
    req.params.taskID = "0";
    req.body = {
        question: "Who is bigger?",
        answers: {
            possible_answers: ["Elyon", "Jhw"],
            correct_answers: [0]
        }
    };
    let res = tasks_taskID_PUT(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("TaskID invalid value");
});

test("with taskID not an integer", () => {
    let req = new Request();
    req.params.taskID = "zero";
    req.body = {
        question: "Who is bigger?",
        answers: {
            possible_answers: ["Elyon", "Jhw"],
            correct_answers: [0]
        }
    };
    let res = tasks_taskID_PUT(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("TaskID is not an integer");
});