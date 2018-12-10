const util = require("../../utility.js");
const Request = util.Request;
const Response = util.Response;

const tasks_taskID_GET = require("../tasks_taskID_GET");
const tasks_taskID_PUT = require("../tasks_taskID_PUT");
const resetDB = require("../../sampleDB").resetDB;

beforeEach(resetDB);

test("tasks_taskID_PUT, update existing task", () => {
    let req = new Request();
    req.params.taskID = "1";
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

    // check task in database
    let reqGet = new Request();
    reqGet.params.taskID = "1";
    let resGet = tasks_taskID_GET(reqGet);

    expect(resGet).toBeInstanceOf(Response);
    expect(resGet.status).toBe(200);
    expect(resGet.json).toBeDefined();
    expect(resGet.json).toEqual({
        id: 1,
        question: "Who is bigger?",
        answers: {
            possible_answers: ["Elyon", "Jhw"],
            correct_answers: [0]
        },
        n_votes: 1324,
        rating: 9.7
    });
});

test("tasks_taskID_PUT, update existing task with existing question", () => {
    let req = new Request();
    req.params.taskID = "1";
    req.body = {
        question: "Is yoza scarso at dota?",
        answers: {
            possible_answers: ["yes", "sure", "obviously"],
            correct_answers: [2]
        }
    };
    let res = tasks_taskID_PUT(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(423);
    expect(res.text).toMatch("A task with such question already exists");
});

test("tasks_taskID_PUT, create task", () => {
    let req = new Request();
    req.params.taskID = "3";
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

    // check task in database
    let reqGet = new Request();
    reqGet.params.taskID = "3";
    let resGet = tasks_taskID_GET(reqGet);

    expect(resGet).toBeInstanceOf(Response);
    expect(resGet.status).toBe(200);
    expect(resGet.json).toBeDefined();
    expect(resGet.json).toEqual({
        id: 3,
        question: "Who is smaller?",
        answers: {
            possible_answers: ["Elyon", "Jhw"],
            correct_answers: [0]
        },
        n_votes: 0,
        rating: 0
    });
});

test("tasks_taskID_PUT, create task with existing question", () => {
    let req = new Request();
    req.params.taskID = "9999124";
    req.body = {
        question: "Wut color is dis?",
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

test("with malformed malformed possible_answers", () => {
    let req = new Request();
    req.params.taskID = "23";
    req.body = {
        question: "What is the reason of this?",
        answers: {
            possible_answers: "Elyon",
            correct_answers: [0]
        }
    };
    let res = tasks_taskID_PUT(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Possible_answers is not an array");
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
    req.params.taskID = "9.2";
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

test("with taskID as word", () => {
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