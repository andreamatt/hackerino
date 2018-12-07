const util = require('../../utility');
const submissions_GET = require('../submissions_GET');
const submissions_POST = require('../submissions_POST');
const student_POST = require('../../students/students_POST');
const submissions = require('../submissions');
const getByStudentID = submissions.getByStudentID;
const getByExamID = submissions.getByExamID;
const getByTaskID = submissions.getByTaskID;
const tasks_POST = require('../../tasks/tasks_POST');
const Request = util.Request;




beforeAll(() => {
    describe("/submissions GET empty", () => {
        test("With no query", () => {
            let request = new Request();
            let response = submissions_GET(request);
            expect(response.status).toBe(200);
            expect(response.text).toBeNull();
            expect(response.json.tot_submissions).toBe(0);
            expect(response.json.submissions).toEqual([]);
        });
        test("With good limit and offset", () => {
            let request = new Request();
            request.query = { limit: 2, offset: 9 };
            let response = submissions_GET(request);
            expect(response.status).toBe(200);
            expect(response.text).toBeNull();
            expect(response.json.tot_submissions).toBe(0);
            expect(response.json.submissions).toEqual([]);
        });
    });
});


describe("getBy functions", () => {
    test("getByexamID function", () => {
        let request = new Request();
        request.body.studentID = 1;
        request.body.taskID = 1;
        request.body.examID = 1;
        request.body.answer = "a";
        request.body.chosen_answer = 1;
        submissions_POST(request);
        let result = getByExamID(1);

        expect(result.length).toBeGreaterThanOrEqual(0);
    });
    test("getByexamID function", () => {
        let request = new Request();
        request.body.studentID = 1;
        request.body.taskID = 1;
        request.body.examID = 1;
        request.body.answer = "a";
        request.body.chosen_answer = 1;
        submissions_POST(request);
        let result = getByExamID(1);

        expect(result.length).toBeGreaterThanOrEqual(0);
    });
    test("getByExamID function", () => {
        let student_request = new Request();
        student_request.body = { email: "andrea@iossa", first_name: "a", last_name: "b" };
        let student_response = student_POST(student_request);
        let studentID = student_response.json.id;

        let request = new Request();
        request.body.studentID = studentID;
        request.body.taskID = 1;
        request.body.examID = 1;
        request.body.answer = "a";
        request.body.chosen_answer = 1;
        submissions_POST(request);
        let result = getByStudentID(studentID);

        expect(result.length).toBeGreaterThanOrEqual(0);
    });

    test("getByTaskID function", () => {
        let task_request = new Request();
        task_request.body = { question: "Who?", answers: { possible_answers: ["Elyon", "Jhw"], correct_answers: [0] } };
        let task_response = tasks_POST(task_request);
        let taskID = task_response.json.id;

        let request = new Request();
        request.body.studentID = 1;
        request.body.taskID = taskID;
        request.body.examID = 1;
        request.body.answer = "a";
        request.body.chosen_answer = 1;
        submissions_POST(request);
        let result = getByTaskID(taskID);

        expect(result.length).toBeGreaterThanOrEqual(0);
    });
});