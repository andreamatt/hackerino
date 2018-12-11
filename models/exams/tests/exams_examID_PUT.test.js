const util = require('../../utility');
const ex_exID_PUT = require('../exams_examID_PUT');
const exams_examID_PUT = ex_exID_PUT.exams_examID_PUT;
const Request = util.Request;

const resetDB = require('../../sampleDB').resetDB;
beforeEach(resetDB);

describe("/exams_examID_PUT good Response", () => {
    test("/exams_examID_PUT with good id (exam updated)", () => {
        let request = new Request();
        request.params.examID = 4;
        request.body.date = "2030/11/11";
        request.body.deadline = "2031/11/11";
        request.body.review_deadline = "2032/11/11";
        let response = exams_examID_PUT(request);

        expect(response.status).toBe(200);
    });

    test("/exams_examID_PUT with good id (exam created)", () => {
        let request = new Request();
        request.params.examID = 5;
        request.body.date = "2030/11/11";
        request.body.deadline = "2031/11/11";
        request.body.review_deadline = "2032/11/11";
        let response = exams_examID_PUT(request);

        expect(response.status).toBe(201);
    });
});

describe("/exams_examID_PUT with bad id parameter", () => {
    test("/exams_examID_PUT with string id", () => {
        let request = new Request();
        request.params.examID = "test";
        request.body.date = "2030/11/11";
        request.body.deadline = "2031/11/11";
        request.body.review_deadline = "2032/11/11";
        let response = exams_examID_PUT(request);

        expect(response.status).toBe(404);
    });

    test("/exams_examID_PUT with negative id", () => {
        let request = new Request();
        request.params.examID = -10;
        request.body.date = "2030/11/11";
        request.body.deadline = "2031/11/11";
        request.body.review_deadline = "2032/11/11";
        let response = exams_examID_PUT(request);

        expect(response.status).toBe(404);
    });
});

describe("/exams_examID_PUT with bad parameter", () => {
    test("/exams_examID_PUT update but date > deadline", () => {
        let request = new Request();
        request.params.examID = 1;
        request.body.date = "2030/11/11";
        request.body.deadline = "2015/11/11";
        request.body.review_deadline = "2032/11/11";
        let response = exams_examID_PUT(request);

        expect(response.status).toBe(400);
        expect(response.text).toBe("deadline needs to be after date");
    });

    test("/exams_examID_PUT create but date > deadline", () => {
        let request = new Request();
        request.params.examID = 5;
        request.body.date = "2030/11/11";
        request.body.deadline = "2015/11/11";
        request.body.review_deadline = "2032/11/11";
        let response = exams_examID_PUT(request);

        expect(response.status).toBe(400);
    });
});