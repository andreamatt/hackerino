const util = require('../../utility');
const exams_GET = require('../exams_GET');
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


describe("exams_GET", () => {
    test("exam GET bad offset", () => {
        let request = new Request();
        request.query = { offset: "a" };
        let response = exams_GET(request);

        expect(response.status).toBe(400);
    });

    test("exam GET bad limit", () => {
        let request = new Request();
        request.query = { limit: "a" };
        let response = exams_GET(request);

        expect(response.status).toBe(400);
    });

    test("exam GET negative offset", () => {
        let request = new Request();
        request.query = { offset: -1 };
        let response = exams_GET(request);

        expect(response.status).toBe(400);
    });

    test("exam GET bad limit", () => {
        let request = new Request();
        request.query = { limit: -1 };
        let response = exams_GET(request);

        expect(response.status).toBe(400);
    });

    test("exam GET good limit", () => {
        let request = new Request();
        request.query = { limit: 10 };
        let response = exams_GET(request);

        expect(response.status).toBe(200);
    });

    test("exam GET good offset", () => {
        let request = new Request();
        request.query = { offset: 10 };
        let response = exams_GET(request);

        expect(response.status).toBe(200);
    });
});