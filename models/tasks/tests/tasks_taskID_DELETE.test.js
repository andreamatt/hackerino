const util = require("../../utility.js");
const Request = util.Request;
const Response = util.Response;


const tasks_taskID_GET = require("../tasks_taskID_GET");
const tasks_taskID_DELETE = require("../tasks_taskID_DELETE");
const exams_examID_tasks_GET = require("../../exams/exams_examID_tasks_GET");
const exams_examID_GET = require("../../exams/exams_examID_GET");
const resetDB = require("../../sampleDB").resetDB;

beforeEach(resetDB);

test("existing task", () => {
    let req = new Request();
    req.params.taskID = "1";
    let res = tasks_taskID_DELETE(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(204);
    expect(res.text).toMatch("Task removed");

    // check if task is removed from tasks_list
    let req0 = new Request();
    req0.params.taskID = "1";
    let res0 = tasks_taskID_GET(req0);

    expect(res0).toBeInstanceOf(Response);
    expect(res0.status).toBe(404);

    // check if task is removed from all exams
    // examID = 3 //
    let req1 = new Request();
    req1.params.examID = "3";
    let res1 = exams_examID_tasks_GET(req1);

    expect(res1).toBeInstanceOf(Response);
    expect(res1.status).toBe(200);
    expect(res1.json).toBeDefined();
    expect(res1.json).toEqual({
        tot_tasks: 3,
        tasks: [
            {
                id: 2,
                question: "?",
                n_votes: 28,
                rating: 0
            },
            {
                id: 555,
                question: "Is yoza scarso at dota?",
                answers: {
                    possible_answers: ["yes", "sure", "obviously"],
                    correct_answers: [0, 1, 2]
                },
                n_votes: 0,
                rating: 0
            },
            {
                id: 911,
                question: "Select A and C",
                answers: {
                    possible_answers: ["A", "B", "C", "D"],
                    correct_answers: [0, 2]
                },
                n_votes: 9999999999,
                rating: 10
            }
        ]
    });

    let req1b = new Request();
    req1b.params.examID = "3";
    let res1b = exams_examID_GET(req1b);

    expect(res1b).toBeInstanceOf(Response);
    expect(res1b.status).toBe(200);
    expect(res1b.json).toBeDefined();
    expect(res1b.json).toEqual({
        id: 3,
        date: "December 17, 1995 03:24:00",
        deadline: "December 18, 1995 03:24:00",
        review_deadline: "Tue Dec 10 2050 13:28:55 GMT+0100 (GMT+01:00)",
        tot_students: 0,
        tot_teachers: 3,
        tot_tasks: 3 //tot_tasks counter must be updated
    });

    // examID = 4 //
    let req2 = new Request();
    req2.params.examID = "4";
    let res2 = exams_examID_tasks_GET(req2);

    expect(res2).toBeInstanceOf(Response);
    expect(res2.status).toBe(200);
    expect(res2.json).toBeDefined();
    expect(res2.json).toEqual({
        tot_tasks: 2,
        tasks: [
            {
                id: 2,
                question: "?",
                n_votes: 28,
                rating: 0
            },
            {
                id: 911,
                question: "Select A and C",
                answers: {
                    possible_answers: ["A", "B", "C", "D"],
                    correct_answers: [0, 2]
                },
                n_votes: 9999999999,
                rating: 10
            }
        ]
    });

    let req2b = new Request();
    req2b.params.examID = "4";
    let res2b = exams_examID_GET(req2b);

    expect(res2b).toBeInstanceOf(Response);
    expect(res2b.status).toBe(200);
    expect(res2b.json).toBeDefined();
    expect(res2b.json).toEqual({
        id: 4,
		date: "December 17, 1995 03:24:00",
		deadline: "December 18, 1995 03:24:00",
		review_deadline: "Tue Dec 10 2000 13:28:55 GMT+0100 (GMT+01:00)",
		tot_students: 3,
		tot_teachers: 2,
		tot_tasks: 2 //tot_tasks counter must be updated
    });
});

test("non existing task", () => {
    let req = new Request();
    req.params.taskID = "3";
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
    req.params.taskID = "9.2";
    let res = tasks_taskID_DELETE(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("TaskID is not an integer");
});

test("with taskID as word", () => {
    let req = new Request();
    req.params.taskID = "three";
    let res = tasks_taskID_DELETE(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(400);
    expect(res.text).toMatch("TaskID is not an integer");
});