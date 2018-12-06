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

test("tasks_GET after each valid POST", () => {
    let req_GET = new Request();
    let req_POST = new Request();
    req_POST.body = {
        question: "How old is Earth?",
        answers: {
            possible_answers: ["6000 years old", "about 4.5B years old", "Earth always existed"],
            correct_answers: [1]
        }
    };
    for (let i = 1; i < 100; i++) {
        req_POST.body.question = "How old is Earth?" + i;
        let res_POST = tasks_POST(req_POST);
        expect(res_POST).toBeInstanceOf(Response);
        expect(res_POST.status).toBe(201);
        expect(res_POST.json).toBeDefined();
        expect(isTask(res_POST.json)).toBe(true);

        let res_GET = tasks_GET(req_GET);
        expect(res_GET).toBeInstanceOf(Response);
        expect(res_GET.status).toBe(200);
        expect(res_GET.json).toBeDefined();
        expect(res_GET.json.tot_tasks).toBeGreaterThanOrEqual(0);
        expect(res_GET.json.tasks).toBeDefined();
        expect(res_GET.json.tasks.length).toBe(i);
        res_GET.json.tasks.every(task => {
            expect(isTask(task)).toBe(true);
        });
    }
});

test("with open with arleady existing question", () => {
    let req = new Request();
    req.body = {
        question: "How old is Earth?1"
    };
    let res = tasks_POST(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(423);
    expect(res.text).toMatch("A task with such question already exists");
});

test("with no question", () => {
    let req = new Request();
    req.body = {
        answers: {
            possible_answers: ["6000 years old", "about 4.5B years old", "Earth always existed"],
            correct_answers: [1]
        }
    };
    let res = tasks_POST(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Question is falsy");
});

test("with open question task (no answers property)", () => {
    let req = new Request();
    req.body = {
        question: "Tell me about it."
    };
    let res = tasks_POST(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(201);
    expect(res.json).toBeDefined();
    expect(isTask(res.json)).toBe(true);
});

test("with answers but no correct answers", () => {
    let req = new Request();
    req.body = {
        question: "How old is Earth?",
        answers: {
            possible_answers: ["6000 years old", "about 4.5B years old", "Earth always existed"]
        }
    };
    let res = tasks_POST(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Correct_answers is falsy");
});

test("with answers but no possible answers", () => {
    let req = new Request();
    req.body = {
        question: "How old is Earth?",
        answers: {
            correct_answers: [1]
        }
    };
    let res = tasks_POST(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Possible_answers is falsy");
});

test("with answers empty", () => {
    let req = new Request();
    req.body = {
        question: "How old is Earth?",
        answers: {}
    };
    let res = tasks_POST(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Possible_answers is falsy");
});

test("with extra properties", () => {
    let req = new Request();
    req.body = {
        question: "How old is Earth?",
        answers: {
            possible_answers: ["6000 years old", "about 4.5B years old", "Earth always existed"],
            correct_answers: [1]
        },
        extra1: 2,
        extra2: { motto: "be brave, stay wild" },
        extra3: [99, 9, 99]
    };
    let res = tasks_POST(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Request body has invalid number of properties");
});

test("with extra properties in answers", () => {
    let req = new Request();
    req.body = {
        question: "How old is Earth?",
        answers: {
            possible_answers: ["6000 years old", "about 4.5B years old", "Earth always existed"],
            correct_answers: [1],
            wrong_answers: [0, 2]
        }
    };
    let res = tasks_POST(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("Answers has invalid number of properties");
});

test("GET with limit = 10", () => {
    let req = new Request();
    req.query.limit = "10";
    let res = tasks_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(200);
    expect(res.json).toBeDefined();
    expect(res.json.tot_tasks).toBeGreaterThanOrEqual(0);
    expect(res.json.tasks).toBeDefined();
    expect(Object.keys(res.json.tasks).length).toBe(10);
    res.json.tasks.every(task => {
        expect(isTask(task)).toBe(true);
    });
});

test("GET with offset = 10000000", () => {
    let req = new Request();
    req.query.offset = "10000000";
    let res = tasks_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(200);
    expect(res.json).toBeDefined();
    expect(res.json.tot_tasks).toBeGreaterThanOrEqual(0);
    expect(res.json.tasks).toBeDefined();
    expect(Object.keys(res.json.tasks).length).toBe(0);
    res.json.tasks.every(task => {
        expect(isTask(task)).toBe(true);
    });
});

test("GET with offset = 10", () => {
    let req = new Request();
    req.query.offset = "10";
    let res = tasks_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(200);
    expect(res.json).toBeDefined();
    expect(res.json.tot_tasks).toBeGreaterThanOrEqual(0);
    expect(res.json.tasks).toBeDefined();
    expect(Object.keys(res.json.tasks).length).toBeGreaterThan(0);
    res.json.tasks.every(task => {
        expect(isTask(task)).toBe(true);
    });
});