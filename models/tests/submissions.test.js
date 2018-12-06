const submissions = require('../submissions');
const util = require('../utility');
const exams = require('../exams');
const students = require('../students');
const tasks = require('../tasks');
const Request = util.Request;
const getByExamID = submissions.getByExamID;
const getByStudentID = submissions.getByStudentID;
const getByTaskID = submissions.getByTaskID;
const submissions_GET = submissions.submissions_GET;
const submission_POST = submissions.submission_POST;
const student_POST = students.students_POST;

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
        submission_POST(request);
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
        submission_POST(request);
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
        submission_POST(request);
        let result = getByStudentID(studentID);

        expect(result.length).toBeGreaterThanOrEqual(0);
    });

    test("getByTaskID function", () => {
        let task_request = new Request();
        task_request.body = { question: "Who?", answers: { possible_answers: ["Elyon", "Jhw"], correct_answers: [0] } };
        let task_response = tasks.tasks_POST(task_request);
        let taskID = task_response.json.id;

        let request = new Request();
        request.body.studentID = 1;
        request.body.taskID = taskID;
        request.body.examID = 1;
        request.body.answer = "a";
        request.body.chosen_answer = 1;
        submission_POST(request);
        let result = getByTaskID(taskID);

        expect(result.length).toBeGreaterThanOrEqual(0);
    });
});

describe("/submissions GET", () => {
    test("submission GET bad examID", () => {
        let request = new Request();
        request.query = { examID: "a" };
        let response = submissions_GET(request);

        expect(response.status).toBe(400);
    });

    test("submission GET bad studentID", () => {
        let request = new Request();
        request.query = { studentID: "a" };
        let response = submissions_GET(request);

        expect(response.status).toBe(400);
    });

    test("submission GET bad task ID", () => {
        let request = new Request();
        request.query = { taskID: "a" };
        let response = submissions_GET(request);

        expect(response.status).toBe(400);
    });

    test("submission GET bad offset", () => {
        let request = new Request();
        request.query = { offset: "a" };
        let response = submissions_GET(request);

        expect(response.status).toBe(400);
    });

    test("submission GET bad limit", () => {
        let request = new Request();
        request.query = { limit: "a" };
        let response = submissions_GET(request);

        expect(response.status).toBe(400);
    });

    test("submission GET negative offset", () => {
        let request = new Request();
        request.query = { offset: -1 };
        let response = submissions_GET(request);

        expect(response.status).toBe(400);
    });

    test("submission GET bad limit", () => {
        let request = new Request();
        request.query = { limit: -1 };
        let response = submissions_GET(request);

        expect(response.status).toBe(400);
    });

    test("submission GET good limit", () => {
        let request = new Request();
        request.query = { limit: 10 };
        let response = submissions_GET(request);

        expect(response.status).toBe(200);
    });

    test("submission GET good offset", () => {
        let request = new Request();
        request.query = { offset: 10 };
        let response = submissions_GET(request);

        expect(response.status).toBe(200);
    });

    test("submission GET filtered by exam", () => {
        let request = new Request();
        request.query = { examID: 1 };
        let response = submissions_GET(request);

        expect(response.status).toBe(200);
    });

    test("submission GET filtered by student", () => {
        let student_request = new Request();
        student_request.body = { email: "antonio@lopardo", first_name: "a", last_name: "b" };
        let student_response = student_POST(student_request);
        let studentID = student_response.json.id;

        let request = new Request();
        request.query = { studentID: studentID };
        let response = submissions_GET(request);

        expect(response.status).toBe(200);
    });

    test("submission GET filtered by task", () => {
        let task_request = new Request();
        task_request.body = { question: "When?", answers: { possible_answers: ["Elyon", "Jhw"], correct_answers: [0] } };
        let task_response = tasks.tasks_POST(task_request);
        let taskID = task_response.json.id;

        let request = new Request();
        request.query = { taskID: taskID };
        let response = submissions_GET(request);

        expect(response.status).toBe(200);
    });
});

describe("/submissions_POST", () => {
    test("submission_POST all working", () => {
        let student_request = new Request();
        student_request.body = { email: "a.b@c", first_name: "a", last_name: "b" };
        let student_response = student_POST(student_request);
        let studentID = student_response.json.id;

        let task_request = new Request();
        task_request.body = { question: "Why?", answers: { possible_answers: ["Elyon", "Jhw"], correct_answers: [0] } };
        let task_response = tasks.tasks_POST(task_request);
        let taskID = task_response.json.id;

        let exam_request = new Request();
        exam_request.body.date = "2001/10/10";
        exam_request.body.deadline = "2030/10/10";
        exam_request.body.review_deadline = "20031/10/10";
        let exam_response = exams.exams_POST(exam_request);
        let examID = exam_response.json.id;

        let request = new Request();
        request.body.studentID = studentID;
        request.body.taskID = taskID;
        request.body.examID = examID;
        request.body.answer = "a";
        request.body.chosen_answer = 1;
        let response = submission_POST(request);

        expect(response.status).toBe(201);
    });

    test("submission_POST with given task not existing", () => {
        let student_request = new Request();
        student_request.body = { email: "a.bc@d", first_name: "a", last_name: "b" };
        let student_response = student_POST(student_request);
        let studentID = student_response.json.id;

        let exam_request = new Request();
        exam_request.body.date = "2001/10/10";
        exam_request.body.deadline = "2030/10/10";
        exam_request.body.review_deadline = "20031/10/10";
        let exam_response = exams.exams_POST(exam_request);
        let examID = exam_response.json.id;

        let request = new Request();
        request.body.studentID = studentID;
        request.body.taskID = 898989;
        request.body.examID = examID;
        request.body.answer = "a";
        request.body.chosen_answer = 1;
        let response = submission_POST(request);

        expect(response.status).toBe(424);
        expect(response.text).toBe("task foreign key can't be resolved.");
    });

    test("submission_POST with given student not existing", () => {
        let task_request = new Request();
        task_request.body = { question: "What?", answers: { possible_answers: ["Elyon", "Jhw"], correct_answers: [0] } };
        let task_response = tasks.tasks_POST(task_request);
        let taskID = task_response.json.id;

        let exam_request = new Request();
        exam_request.body.date = "2001/10/10";
        exam_request.body.deadline = "2030/10/10";
        exam_request.body.review_deadline = "20031/10/10";
        let exam_response = exams.exams_POST(exam_request);
        let examID = exam_response.json.id;

        let request = new Request();
        request.body.studentID = 1323113;
        request.body.taskID = taskID;
        request.body.examID = examID;
        request.body.answer = "a";
        request.body.chosen_answer = 1;
        let response = submission_POST(request);

        expect(response.status).toBe(424);
        expect(response.text).toBe("student foreign key can't be resolved.");
    });

    test("submission_POST with given exam not existing", () => {
        let task_request = new Request();
        task_request.body = { question: "How?", answers: { possible_answers: ["Elyon", "Jhw"], correct_answers: [0] } };
        let task_response = tasks.tasks_POST(task_request);
        let taskID = task_response.json.id;

        let request = new Request();
        request.body.studentID = 1;
        request.body.taskID = taskID;
        request.body.examID = 4;
        request.body.answer = "a";
        request.body.chosen_answer = 1;
        let response = submission_POST(request);

        expect(response.status).toBe(424);
        expect(response.text).toBe("exam foreign key can't be resolved.");
    });

    test("submission_POST with deadline reached", () => {
        let student_request = new Request();
        student_request.body = { email: "a.bcd@e", first_name: "a", last_name: "b" };
        let student_response = student_POST(student_request);
        let studentID = student_response.json.id;

        let task_request = new Request();
        task_request.body = { question: "???", answers: { possible_answers: ["Elyon", "Jhw"], correct_answers: [0] } };
        let task_response = tasks.tasks_POST(task_request);
        let taskID = task_response.json.id;

        let exam_request = new Request();
        exam_request.body.date = "2001/10/10";
        exam_request.body.deadline = "2002/10/10";
        exam_request.body.review_deadline = "20031/10/10";
        let exam_response = exams.exams_POST(exam_request);
        let examID = exam_response.json.id;

        let request = new Request();
        request.body.studentID = studentID;
        request.body.taskID = taskID;
        request.body.examID = examID;
        request.body.answer = "a";
        request.body.chosen_answer = 1;
        let response = submission_POST(request);

        expect(response.status).toBe(423);
        expect(response.text).toBe("Deadline reached: cannot change submission.");
    });

    test("submissions_POST with same submission already registered", () => {
        let student_request = new Request();
        student_request.body = { email: "a.bcde@f", first_name: "a", last_name: "b" };
        let student_response = student_POST(student_request);
        let studentID = student_response.json.id;

        let task_request = new Request();
        task_request.body = { question: "?!?!?", answers: { possible_answers: ["Elyon", "Jhw"], correct_answers: [0] } };
        let task_response = tasks.tasks_POST(task_request);
        let taskID = task_response.json.id;

        let exam_request = new Request();
        exam_request.body.date = "2001/10/10";
        exam_request.body.deadline = "2030/10/10";
        exam_request.body.review_deadline = "20031/10/10";
        let exam_response = exams.exams_POST(exam_request);
        let examID = exam_response.json.id;

        let request = new Request();
        request.body.studentID = studentID;
        request.body.taskID = taskID;
        request.body.examID = examID;
        request.body.answer = "a";
        request.body.chosen_answer = 1;
        let response = submission_POST(request);

        let same_request = new Request();
        same_request.body.studentID = studentID;
        same_request.body.taskID = taskID;
        same_request.body.examID = examID;
        same_request.body.answer = "b";
        same_request.body.chosen_answer = 2;
        let same_response = submission_POST(same_request);

        expect(response.status).toBe(201);
        expect(same_response.status).toBe(451);
        expect(same_response.text).toBe("This student has already submitted this task during this exam. If you want to update it, use PUT /submissions/submissionID instead.");
    });

    test("submissions_POST with exam body paramater wrong", () => {
        let student_request = new Request();
        student_request.body = { email: "a.bcdef@g", first_name: "a", last_name: "b" };
        let student_response = student_POST(student_request);
        let studentID = student_response.json.id;

        let task_request = new Request();
        task_request.body = { question: "?!?!?!?", answers: { possible_answers: ["Elyon", "Jhw"], correct_answers: [0] } };
        let task_response = tasks.tasks_POST(task_request);
        let taskID = task_response.json.id;

        let request = new Request();
        request.body.studentID = studentID;
        request.body.taskID = taskID;
        request.body.examID = "ciao";
        request.body.answer = "a";
        request.body.chosen_answer = 1;
        let response = submission_POST(request);

        expect(response.status).toBe(400);
    });

    test("submissions_POST with student body paramater wrong", () => {
        let task_request = new Request();
        task_request.body = { question: "Wut?", answers: { possible_answers: ["Elyon", "Jhw"], correct_answers: [0] } };
        let task_response = tasks.tasks_POST(task_request);
        let taskID = task_response.json.id;

        let exam_request = new Request();
        exam_request.body.date = "2001/10/10";
        exam_request.body.deadline = "2030/10/10";
        exam_request.body.review_deadline = "20031/10/10";
        let exam_response = exams.exams_POST(exam_request);
        let examID = exam_response.json.id;

        let request = new Request();
        request.body.studentID = "ciao";
        request.body.taskID = taskID;
        request.body.examID = examID;
        request.body.answer = "a";
        request.body.chosen_answer = 1;
        let response = submission_POST(request);

        expect(response.status).toBe(400);
    });

    test("submissions_POST with task body paramater wrong", () => {
        let student_request = new Request();
        student_request.body = { email: "a.bcdefg@h", first_name: "a", last_name: "b" };
        let student_response = student_POST(student_request);
        let studentID = student_response.json.id;

        let exam_request = new Request();
        exam_request.body.date = "2001/10/10";
        exam_request.body.deadline = "2030/10/10";
        exam_request.body.review_deadline = "20031/10/10";
        let exam_response = exams.exams_POST(exam_request);
        let examID = exam_response.json.id;

        let request = new Request();
        request.body.studentID = studentID;
        request.body.taskID = "ciao";
        request.body.examID = examID;
        request.body.answer = "a";
        request.body.chosen_answer = 1;
        let response = submission_POST(request);

        expect(response.status).toBe(400);
    });

    test("submissions_POST with answer body paramater wrong", () => {
        let student_request = new Request();
        student_request.body = { email: "a.bcdefgh@i", first_name: "a", last_name: "b" };
        let student_response = student_POST(student_request);
        let studentID = student_response.json.id;

        let task_request = new Request();
        task_request.body = { question: "2 + 2?", answers: { possible_answers: ["Elyon", "Jhw"], correct_answers: [0] } };
        let task_response = tasks.tasks_POST(task_request);
        let taskID = task_response.json.id;

        let exam_request = new Request();
        exam_request.body.date = "2001/10/10";
        exam_request.body.deadline = "2030/10/10";
        exam_request.body.review_deadline = "20031/10/10";
        let exam_response = exams.exams_POST(exam_request);
        let examID = exam_response.json.id;


        let request = new Request();
        request.body.studentID = studentID;
        request.body.taskID = taskID;
        request.body.examID = examID;
        request.body.answer = 99999;
        request.body.chosen_answer = 1;
        let response = submission_POST(request);

        expect(response.status).toBe(400);
    });

    test("submissions_POST with chosen_answer body paramater wrong", () => {
        let request = new Request();
        request.body.studentID = 1;
        request.body.taskID = 1;
        request.body.examID = 1;
        request.body.answer = 99999;
        request.body.chosen_answer = "ciao";
        let response = submission_POST(request);

        expect(response.status).toBe(400);
    });

    test("submissions_POST with chosen_answer body paramater wrong", () => {
        let request = new Request();
        request.body.studentID = -1;
        request.body.taskID = 1;
        request.body.examID = 1;
        request.body.answer = 99999;
        request.body.chosen_answer = 1;
        let response = submission_POST(request);

        expect(response.status).toBe(400);
    });
});