const util = require('../../utility');
const exams_GET = require('../exams_GET');
const exams_POST = require('../exams_POST');
const exams_examID_GET = require('../exams_examID_GET');
const Request = util.Request;



beforeAll(() => {
    describe("/exams GET empty", () => {
        test("With no query", () => {
            let request = new Request();
            let response = exams_GET(request);
            expect(response.status).toBe(200);
            expect(response.json.tot_exams).toBe(0);
            expect(response.json.exams).toEqual([]);
        });
        test("With good limit and offset", () => {
            let request = new Request();
            request.query = { limit: 2, offset: 9 };
            let response = exams_GET(request);
            expect(response.status).toBe(200);
            expect(response.json.tot_exams).toBe(0);
            expect(response.json.exams).toEqual([]);
        });
    });
});




describe("/exams_examID_GET", () => {
    test("exams_exam_GET with id parameter string", () => {
        let request = new Request();
        request.params.examID = "q";
        let response = exams_examID_GET(request);

        expect(response.status).toBe(404);
    });

    test("exams_exam_GET with non existing id", () => {
        let request = new Request();
        request.params.examID = "99";
        let response = exams_examID_GET(request);

        expect(response.status).toBe(404);
    });

    test("exams_exam_GET with existing id", () => {
        let request = new Request();
        request.body.date = "2001/10/10";
        request.body.deadline = "2002/10/10";
        request.body.review_deadline = "2003/10/10";
        let response = exams_POST(request);
        expect(response.status).toBe(201);
        let id = response.json.id;

        let req = new Request();
        req.params.examID = id;
        let res = exams_examID_GET(req);
        expect(res.status).toBe(200);
    });
});