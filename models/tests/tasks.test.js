const util = require("../utility.js");
const Request = util.Request;
const Response = util.Response;
const isTask = util.isTask;

const tasks = require("../tasks.js");
const tasks_GET = tasks.tasks_GET;
const tasks_POST = tasks.tasks_POST;



test("generic tasks_GET", () => {
    let req = new Request();
    let res = tasks_GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(200);
    expect(res.text).toBeNull();
    expect(res.json).toBeDefined();
    expect(res.json.tot_tasks).toBeGreaterThanOrEqual(0);
    expect(res.json.tasks).toBeDefined();
    res.json.tasks.every(task => {
        expect(isTask(task)).toBe(true);
    });
});

test("tasks_GET with limit and empty tasks_list", () => {
    let req = new Request();
    let res = tasks_GET(req);
    req.query.limit = 10;

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(200);
    expect(res.text).toBeNull();
    expect(res.json).toBeDefined();
    expect(res.json.tot_tasks).toBeGreaterThanOrEqual(0);
    expect(res.json.tasks).toBeDefined();
    expect(res.json.tasks.length).toBe(0);
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
    expect(res.json.tasks).toBeDefined();
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
    expect(res.json.tasks).toBeDefined();
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
        let res_POST = tasks_POST(req_POST);
        expect(res_POST).toBeInstanceOf(Response);
        expect(res_POST.status).toBe(201);
        expect(res_POST.text).toBeNull();
        expect(res_POST.json).toBeDefined();
        expect(isTask(res_POST.json).bool).toBe(true);

        let res_GET = tasks_GET(req_GET);
        expect(res_GET).toBeInstanceOf(Response);
        expect(res_GET.status).toBe(200);
        expect(res_GET.text).toBeNull();
        expect(res_GET.json).toBeDefined();
        expect(res_GET.json.tot_tasks).toBeGreaterThanOrEqual(0);
        expect(res_GET.json.tasks).toBeDefined();
        expect(res_GET.json.tasks.length).toBe(i);
        res_GET.json.tasks.every(task => {
            expect(isTask(task).bool).toBe(true);
        });
    }
});

test("tasks_POST with no question", () => {
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
    expect(res.text).toMatch("question is falsy");
    expect(res.json).toBeNull();
});

test("tasks_POST with open question task (no answers property)", () => {
    let req = new Request();
    req.body = {
        question: "Tell me about it."
    };
    let res = tasks_POST(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(201);
    expect(res.json).toBeDefined();
    expect(res.text).toBe(null);
    expect(res.json).toBeDefined();
    expect(isTask(res.json).bool).toBe(true);
});

test("tasks_POST with answers but no correct answers", () => {
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
    expect(res.text).toMatch("correct_answers is falsy");
    expect(res.json).toBeNull();
});

test("tasks_POST with answers but no possible answers", () => {
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
    expect(res.text).toMatch("possible_answers is falsy");
    expect(res.json).toBeNull();
});

test("tasks_POST with answers empty", () => {
    let req = new Request();
    req.body = {
        question: "How old is Earth?",
        answers: {}
    };
    let res = tasks_POST(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("possible_answers is falsy");
    expect(res.json).toBeNull();
});

test("tasks_POST with extra properties", () => {
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
    expect(res.text).toMatch("request body has invalid number of properties");
    expect(res.json).toBeNull();
});

test("tasks_POST with extra properties in answers", () => {
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
    expect(res.text).toMatch("answers has invalid number of properties");
    expect(res.json).toBeNull();
});