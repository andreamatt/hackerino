const submissions_GET = require('../submissions_GET');
const util = require('../../utility');
const Request = util.Request;

describe("/submissions GET", () => {

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

    test("submission GET double offset", () => {
        let request = new Request();
        request.query = { offset: 0.5 };
        let response = submissions_GET(request);

        expect(response.status).toBe(400);
    });

    test("submission GET double limit", () => {
        let request = new Request();
        request.query = { limit: 0.5 };
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
});