const util = require('../../utility');
const ex_exID_GET = require('../exams_examID_GET');
const exams_examID_GET = ex_exID_GET.exams_examID_GET;
const Request = util.Request;

const resetDB = require('../../sampleDB').resetDB;
beforeEach(resetDB);


describe("/exams_examID_GET good Response", () => {
    test("exams_examID_GET al working", () => {
        let request = new Request();
        request.params.examID = 4;
        let response = exams_examID_GET(request);

        expect(response.status).toBe(200);
        expect(response.json.id).toBe(4);
    });
});


describe("/exams_examID_GET wrong parameters", () => {
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
});