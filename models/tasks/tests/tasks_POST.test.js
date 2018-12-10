const util = require("../../utility.js");
const Request = util.Request;
const Response = util.Response;

const tasks_GET = require("../tasks_GET");
const tasks_POST = require("../tasks_POST");
const resetDB = require("../../sampleDB").resetDB;

beforeEach(resetDB);

function checkTasks(quantity) {
    let req = new Request();
    let res = tasks_GET(req);
    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(200);
    expect(res.json).toBeDefined();
    expect(res.json.tot_tasks).toBe(quantity);
    expect(res.json.tasks).toBeDefined();
    expect(res.json.tasks.length).toBe(quantity);
};

test("many valid POST", () => {
    let req = new Request();
    req.body = {
        question: "How old is Earth?",
        answers: {
            possible_answers: ["6000 years old", "about 4.5B years old", "Earth always existed"],
            correct_answers: [1]
        }
    };
    for (let i = 1; i < 100; i++) {
        req.body.question = "How old is Earth?" + i;
        let res = tasks_POST(req);
        expect(res).toBeInstanceOf(Response);
        expect(res.status).toBe(201);
        expect(res.json).toBeDefined();
        expect(res.json).toEqual({
            id: 2 + i,
            question: "How old is Earth?" + i,
            answers: {
                possible_answers: ["6000 years old", "about 4.5B years old", "Earth always existed"],
                correct_answers: [1]
            },
            n_votes: 0,
            rating: 0
        });
        checkTasks(4 + i);
    }
});

test("with arleady existing question", () => {
    let req = new Request();
    req.body = {
        question: "Wut color is dis?"
    };
    let res = tasks_POST(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(423);
    expect(res.text).toMatch("A task with such question already exists");
    checkTasks(4);
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
    checkTasks(4);
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
    expect(res.json).toEqual({
        id: 3,
        question: "Tell me about it.",
        n_votes: 0,
        rating: 0
    });
    checkTasks(5);
});

test("with possible_answers but no correct_answers", () => {
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
    checkTasks(4);
});

test("with correct_answers but no possible_answers", () => {
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
    checkTasks(4);
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
    checkTasks(4);
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
    checkTasks(4);
});
