const util = require('../../utility');
const exams_GET = require('../exams_GET');
const exams_POST = require('../exams_POST');
const Request = util.Request;

const resetDB = require('../../sampleDB').resetDB;
beforeEach(resetDB);


describe("/exams_POST good Response", () => {
    test("exams_POST working", () => {
        let request = new Request();
        request.body.date = "2001/10/10";
        request.body.deadline = "2002/10/10";
        request.body.review_deadline = "2003/10/10";
        let response = exams_POST(request);

        expect(response.status).toBe(201);
    });
});

describe("/exams_POST with bad parameters", () => {
    test("exams_POST date > deadline", () => {
        let request = new Request();
        request.body.date = "2003/10/10";
        request.body.deadline = "2002/10/10";
        request.body.review_deadline = "2003/10/10";
        let response = exams_POST(request);

        expect(response.status).toBe(400);
    });

    test("exams_POST with bad date", () => {
        let request = new Request();
        request.body.date = "andrea matte";
        request.body.deadline = "2002/10/10";
        request.body.review_deadline = "2003/10/10";
        let response = exams_POST(request);

        expect(response.status).toBe(400);
    });

    test("exams_POST with bad deadline", () => {
        let request = new Request();
        request.body.date = "2001/10/10";
        request.body.deadline = "andrei diaconu";
        request.body.review_deadline = "2003/10/10";
        let response = exams_POST(request);

        expect(response.status).toBe(400);
    });

    test("exams_POST with bad review_deadline", () => {
        let request = new Request();
        request.body.date = "2001/10/10";
        request.body.deadline = "2002/10/10";
        request.body.review_deadline = "andrea iossa";
        let response = exams_POST(request);

        expect(response.status).toBe(400);
    });
});



