const util = require('../../utility');
const ex_GET = require('../exams_GET');
const exams_GET = ex_GET.exams_GET;
const Request = util.Request;

const resetDB = require('../../sampleDB').resetDB;
beforeEach(resetDB);


describe("exams_GET good Response", () => {
    test("exams_GET with no parameters", () => {
        let request = new Request();
        let response = exams_GET(request);

        expect(response.status).toBe(200);
    });

    test("exams_GET with good limit", () => {
        let request = new Request();
        request.query.limit = 10;
        let response = exams_GET(request);

        expect(response.status).toBe(200);
    });

    test("exams_GET with good offset", () => {
        let request = new Request();
        request.query.offset = 3;
        let response = exams_GET(request);

        expect(response.status).toBe(200);
    });
});

describe("exams_GET bad parameters", () => {
    test("exams_GET with negative limit", () => {
        let request = new Request();
        request.query.limit = -10;
        let response = exams_GET(request);

        expect(response.status).toBe(400);
    });

    test("exams_GET with negative offset", () => {
        let request = new Request();
        request.query.offset = -3;
        let response = exams_GET(request);

        expect(response.status).toBe(400);
    });

    test("exams_GET with double limit", () => {
        let request = new Request();
        request.query.limit = 0.5;
        let response = exams_GET(request);

        expect(response.status).toBe(400);
    });

    test("exams_GET with double offset", () => {
        let request = new Request();
        request.query.offset = 0.5;
        let response = exams_GET(request);

        expect(response.status).toBe(400);
    });

    test("exams_GET with string limit", () => {
        let request = new Request();
        request.query.limit = "test";
        let response = exams_GET(request);

        expect(response.status).toBe(400);
    });

    test("exams_GET with string offset", () => {
        let request = new Request();
        request.query.offset = "test";
        let response = exams_GET(request);

        expect(response.status).toBe(400);
    });
});