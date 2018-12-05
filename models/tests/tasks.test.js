const util = require("../utility.js");
const Request = util.Request;
const Response = util.Response;
const isTask = util.isTask;

const tasks = require("../tasks.js");
const tasks_GET = tasks.tasks_GET;
const tasks_POST = tasks.tasks_POST;
const tasks_taskID_GET = tasks.tasks_taskID_GET;
const tasks_taskID_PUT = tasks.tasks_taskID_PUT;
const tasks_taskID_DELETE = tasks.tasks_taskID_DELETE;
const tasks_taskID_vote_POST = tasks.tasks_taskID_vote_POST;


describe("/tasks GET", () => {
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
});

describe("/tasks POST", () => {
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
});

describe("/tasks/taskID GET", () => {
    test("with id=1", () => {
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
});

describe("/tasks/taskID PUT", () => {
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
});

describe("/tasks/taskID DELETE", () => {
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
});

describe("/tasks/taskID/vote POST", () => {
    test("with valid vote for existing task without votes", () => {
        let req = new Request();
        req.params.taskID = "5";
        req.body.vote = 9.5;
        let res = tasks_taskID_vote_POST(req);

        expect(res).toBeInstanceOf(Response);
        expect(res.status).toBe(204);

        // checking for updated rating
        res = tasks_taskID_GET(req);
        expect(res).toBeInstanceOf(Response);
        expect(res.status).toBe(200);
        expect(res.json).toBeDefined();
        expect(isTask(res.json)).toBe(true);
        expect(res.json.rating).toBe(req.body.vote);
    });

    test("with valid vote for existing task having one vote", () => {
        let req = new Request();
        req.params.taskID = "5";
        req.body.vote = 0;
        let res = tasks_taskID_vote_POST(req);

        expect(res).toBeInstanceOf(Response);
        expect(res.status).toBe(204);

        // checking for updated rating
        res = tasks_taskID_GET(req);
        expect(res).toBeInstanceOf(Response);
        expect(res.status).toBe(200);
        expect(res.json).toBeDefined();
        expect(isTask(res.json)).toBe(true);
        expect(res.json.rating).toBe(4.75);
    });

    test("with valid vote for non existing task", () => {
        let req = new Request();
        req.params.taskID = "31245";
        req.body.vote = 0;
        let res = tasks_taskID_vote_POST(req);

        expect(res).toBeInstanceOf(Response);
        expect(res.status).toBe(404);
    });

    test("with vote NaN", () => {
        let req = new Request();
        req.params.taskID = "5";
        req.body.vote = "Africa";
        let res = tasks_taskID_vote_POST(req);

        expect(res).toBeInstanceOf(Response);
        expect(res.status).toBe(400);
        expect(res.text).toMatch("Vote is NaN");
    });

    test("with vote > 10", () => {
        let req = new Request();
        req.params.taskID = "5";
        req.body.vote = 10.01;
        let res = tasks_taskID_vote_POST(req);

        expect(res).toBeInstanceOf(Response);
        expect(res.status).toBe(400);
        expect(res.text).toMatch("Vote is out of valid range");
    });

    test("with vote < 0", () => {
        let req = new Request();
        req.params.taskID = "5";
        req.body.vote = -1;
        let res = tasks_taskID_vote_POST(req);

        expect(res).toBeInstanceOf(Response);
        expect(res.status).toBe(400);
        expect(res.text).toMatch("Vote is out of valid range");
    });

    test("update tasks rating many times", () => {
        let req_GET = new Request();
        let req_POST = new Request();
        req_POST.params.taskID = 2;

        // check old average
        let res_GET1 = tasks_taskID_GET(req_POST);
        expect(res_GET1).toBeInstanceOf(Response);
        expect(res_GET1.status).toBe(200);
        expect(res_GET1.json).toBeDefined();
        expect(isTask(res_GET1.json)).toBe(true);
        let rating = res_GET1.json.rating;
        let n_votes = res_GET1.json.n_votes;

        for (let i = 0; i <= 10; i++) {
            // modify average
            req_POST.body.vote = i;
            let res_POST = tasks_taskID_vote_POST(req_POST);
            expect(res_POST).toBeInstanceOf(Response);
            expect(res_POST.status).toBe(204);

            // check new average
            let res_GET2 = tasks_taskID_GET(req_POST);
            expect(res_GET2).toBeInstanceOf(Response);
            expect(res_GET2.status).toBe(200);
            expect(res_GET2.json).toBeDefined();
            expect(isTask(res_GET2.json)).toBe(true);

            rating = (n_votes * rating + i) / (n_votes + 1);
            n_votes++;
            expect(res_GET2.json.rating).toBe(rating);
        }
    });

    test("with malformed body", () => {
        let req = new Request();
        req.params.taskID = "5";
        req.body.vote = 2;
        req.body.extra = "extra";
        let res = tasks_taskID_vote_POST(req);

        expect(res).toBeInstanceOf(Response);
        expect(res.status).toBe(400);
        expect(res.text).toMatch("Request body has invalid number of properties");
    });

    test("with taskID not an integer", () => {
        let req = new Request();
        req.params.taskID = "two";
        req.body.vote = 2;
        let res = tasks_taskID_vote_POST(req);

        expect(res).toBeInstanceOf(Response);
        expect(res.status).toBe(400);
        expect(res.text).toMatch("TaskID is not an integer");
    });

    test("with invalid taskID", () => {
        let req = new Request();
        req.params.taskID = "0";
        req.body.vote = 2;
        let res = tasks_taskID_vote_POST(req);

        expect(res).toBeInstanceOf(Response);
        expect(res.status).toBe(400);
        expect(res.text).toMatch("TaskID invalid value");
    });
});



