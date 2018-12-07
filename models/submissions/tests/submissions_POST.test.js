const util = require('../../utility');
const submissions_POST = require('../submissions_POST');
const exams_POST = require('../../exams/exams_POST');
const students_POST = require('../../students/students_POST');
const tasks_POST = require('../../tasks/tasks_POST');
const Request = util.Request;


describe("/submissions_POST", () => {
    test("submissions_POST all working", () => {
        let student_request = new Request();
        student_request.body = { email: "a.b@c", first_name: "a", last_name: "b" };
        let student_response = students_POST(student_request);
        let studentID = student_response.json.id;

        let task_request = new Request();
        task_request.body = { question: "Why?", answers: { possible_answers: ["Elyon", "Jhw"], correct_answers: [0] } };
        let task_response = tasks_POST(task_request);
        let taskID = task_response.json.id;

        let exam_request = new Request();
        exam_request.body.date = "2001/10/10";
        exam_request.body.deadline = "2030/10/10";
        exam_request.body.review_deadline = "20031/10/10";
        let exam_response = exams_POST(exam_request);
        let examID = exam_response.json.id;

        let request = new Request();
        request.body.studentID = studentID;
        request.body.taskID = taskID;
        request.body.examID = examID;
        request.body.answer = "a";
        request.body.chosen_answer = 1;
        let response = submissions_POST(request);

        expect(response.status).toBe(201);
    });

    test("submissions_POST with given task not existing", () => {
        let student_request = new Request();
        student_request.body = { email: "a.bc@d", first_name: "a", last_name: "b" };
        let student_response = students_POST(student_request);
        let studentID = student_response.json.id;

        let exam_request = new Request();
        exam_request.body.date = "2001/10/10";
        exam_request.body.deadline = "2030/10/10";
        exam_request.body.review_deadline = "20031/10/10";
        let exam_response = exams_POST(exam_request);
        let examID = exam_response.json.id;

        let request = new Request();
        request.body.studentID = studentID;
        request.body.taskID = 898989;
        request.body.examID = examID;
        request.body.answer = "a";
        request.body.chosen_answer = 1;
        let response = submissions_POST(request);

        expect(response.status).toBe(424);
        expect(response.text).toBe("task foreign key can't be resolved.");
    });

    test("submissions_POST with given student not existing", () => {
        let task_request = new Request();
        task_request.body = { question: "What?", answers: { possible_answers: ["Elyon", "Jhw"], correct_answers: [0] } };
        let task_response = tasks_POST(task_request);
        let taskID = task_response.json.id;

        let exam_request = new Request();
        exam_request.body.date = "2001/10/10";
        exam_request.body.deadline = "2030/10/10";
        exam_request.body.review_deadline = "20031/10/10";
        let exam_response = exams_POST(exam_request);
        let examID = exam_response.json.id;

        let request = new Request();
        request.body.studentID = 1323113;
        request.body.taskID = taskID;
        request.body.examID = examID;
        request.body.answer = "a";
        request.body.chosen_answer = 1;
        let response = submissions_POST(request);

        expect(response.status).toBe(424);
        expect(response.text).toBe("student foreign key can't be resolved.");
    });

    test("submissions_POST with given exam not existing", () => {
        let task_request = new Request();
        task_request.body = { question: "How?", answers: { possible_answers: ["Elyon", "Jhw"], correct_answers: [0] } };
        let task_response = tasks_POST(task_request);
        let taskID = task_response.json.id;

        let request = new Request();
        request.body.studentID = 1;
        request.body.taskID = taskID;
        request.body.examID = 4;
        request.body.answer = "a";
        request.body.chosen_answer = 1;
        let response = submissions_POST(request);

        expect(response.status).toBe(424);
        expect(response.text).toBe("exam foreign key can't be resolved.");
    });

    test("submissions_POST with deadline reached", () => {
        let student_request = new Request();
        student_request.body = { email: "a.bcd@e", first_name: "a", last_name: "b" };
        let student_response = students_POST(student_request);
        let studentID = student_response.json.id;

        let task_request = new Request();
        task_request.body = { question: "???", answers: { possible_answers: ["Elyon", "Jhw"], correct_answers: [0] } };
        let task_response = tasks_POST(task_request);
        let taskID = task_response.json.id;

        let exam_request = new Request();
        exam_request.body.date = "2001/10/10";
        exam_request.body.deadline = "2002/10/10";
        exam_request.body.review_deadline = "20031/10/10";
        let exam_response = exams_POST(exam_request);
        let examID = exam_response.json.id;

        let request = new Request();
        request.body.studentID = studentID;
        request.body.taskID = taskID;
        request.body.examID = examID;
        request.body.answer = "a";
        request.body.chosen_answer = 1;
        let response = submissions_POST(request);

        expect(response.status).toBe(423);
        expect(response.text).toBe("Deadline reached: cannot change submission.");
    });

    test("submissions_POST with same submission already registered", () => {
        let student_request = new Request();
        student_request.body = { email: "a.bcde@f", first_name: "a", last_name: "b" };
        let student_response = students_POST(student_request);
        let studentID = student_response.json.id;

        let task_request = new Request();
        task_request.body = { question: "?!?!?", answers: { possible_answers: ["Elyon", "Jhw"], correct_answers: [0] } };
        let task_response = tasks_POST(task_request);
        let taskID = task_response.json.id;

        let exam_request = new Request();
        exam_request.body.date = "2001/10/10";
        exam_request.body.deadline = "2030/10/10";
        exam_request.body.review_deadline = "20031/10/10";
        let exam_response = exams_POST(exam_request);
        let examID = exam_response.json.id;

        let request = new Request();
        request.body.studentID = studentID;
        request.body.taskID = taskID;
        request.body.examID = examID;
        request.body.answer = "a";
        request.body.chosen_answer = 1;
        let response = submissions_POST(request);

        let same_request = new Request();
        same_request.body.studentID = studentID;
        same_request.body.taskID = taskID;
        same_request.body.examID = examID;
        same_request.body.answer = "b";
        same_request.body.chosen_answer = 2;
        let same_response = submissions_POST(same_request);

        expect(response.status).toBe(201);
        expect(same_response.status).toBe(451);
        expect(same_response.text).toBe("This student has already submitted this task during this exam. If you want to update it, use PUT /submissions/submissionID instead.");
    });

    test("submissions_POST with exam body paramater wrong", () => {
        let student_request = new Request();
        student_request.body = { email: "a.bcdef@g", first_name: "a", last_name: "b" };
        let student_response = students_POST(student_request);
        let studentID = student_response.json.id;

        let task_request = new Request();
        task_request.body = { question: "?!?!?!?", answers: { possible_answers: ["Elyon", "Jhw"], correct_answers: [0] } };
        let task_response = tasks_POST(task_request);
        let taskID = task_response.json.id;

        let request = new Request();
        request.body.studentID = studentID;
        request.body.taskID = taskID;
        request.body.examID = "ciao";
        request.body.answer = "a";
        request.body.chosen_answer = 1;
        let response = submissions_POST(request);

        expect(response.status).toBe(400);
    });

    test("submissions_POST with student body paramater wrong", () => {
        let task_request = new Request();
        task_request.body = { question: "Wut?", answers: { possible_answers: ["Elyon", "Jhw"], correct_answers: [0] } };
        let task_response = tasks_POST(task_request);
        let taskID = task_response.json.id;

        let exam_request = new Request();
        exam_request.body.date = "2001/10/10";
        exam_request.body.deadline = "2030/10/10";
        exam_request.body.review_deadline = "20031/10/10";
        let exam_response = exams_POST(exam_request);
        let examID = exam_response.json.id;

        let request = new Request();
        request.body.studentID = "ciao";
        request.body.taskID = taskID;
        request.body.examID = examID;
        request.body.answer = "a";
        request.body.chosen_answer = 1;
        let response = submissions_POST(request);

        expect(response.status).toBe(400);
    });

    test("submissions_POST with task body paramater wrong", () => {
        let student_request = new Request();
        student_request.body = { email: "a.bcdefg@h", first_name: "a", last_name: "b" };
        let student_response = students_POST(student_request);
        let studentID = student_response.json.id;

        let exam_request = new Request();
        exam_request.body.date = "2001/10/10";
        exam_request.body.deadline = "2030/10/10";
        exam_request.body.review_deadline = "20031/10/10";
        let exam_response = exams_POST(exam_request);
        let examID = exam_response.json.id;

        let request = new Request();
        request.body.studentID = studentID;
        request.body.taskID = "ciao";
        request.body.examID = examID;
        request.body.answer = "a";
        request.body.chosen_answer = 1;
        let response = submissions_POST(request);

        expect(response.status).toBe(400);
    });

    test("submissions_POST with answer body paramater wrong", () => {
        let student_request = new Request();
        student_request.body = { email: "a.bcdefgh@i", first_name: "a", last_name: "b" };
        let student_response = students_POST(student_request);
        let studentID = student_response.json.id;

        let task_request = new Request();
        task_request.body = { question: "2 + 2?", answers: { possible_answers: ["Elyon", "Jhw"], correct_answers: [0] } };
        let task_response = tasks_POST(task_request);
        let taskID = task_response.json.id;

        let exam_request = new Request();
        exam_request.body.date = "2001/10/10";
        exam_request.body.deadline = "2030/10/10";
        exam_request.body.review_deadline = "20031/10/10";
        let exam_response = exams_POST(exam_request);
        let examID = exam_response.json.id;


        let request = new Request();
        request.body.studentID = studentID;
        request.body.taskID = taskID;
        request.body.examID = examID;
        request.body.answer = 99999;
        request.body.chosen_answer = 1;
        let response = submissions_POST(request);

        expect(response.status).toBe(400);
    });

    test("submissions_POST with chosen_answer body paramater wrong", () => {
        let request = new Request();
        request.body.studentID = 1;
        request.body.taskID = 1;
        request.body.examID = 1;
        request.body.answer = 99999;
        request.body.chosen_answer = "ciao";
        let response = submissions_POST(request);

        expect(response.status).toBe(400);
    });

    test("submissions_POST with chosen_answer body paramater wrong", () => {
        let request = new Request();
        request.body.studentID = -1;
        request.body.taskID = 1;
        request.body.examID = 1;
        request.body.answer = 99999;
        request.body.chosen_answer = 1;
        let response = submissions_POST(request);

        expect(response.status).toBe(400);
    });
});