const teachers = require('../teachers');
const util = require('../utility');
const Request = util.Request;
const teachers_GET = teachers.teachers_GET;
const teachers_POST = teachers.teachers_POST;
const teachers_teacherID_GET = teachers.teachers_teacherID_GET;
const teachers_teacherID_PUT = teachers.teachers_teacherID_PUT;

beforeAll(() => {
    describe("/teachers GET empty", () => {
        test("With no query", () => {
            let request = new Request();
            let response = teachers_GET(request);
            expect(response.status).toBe(200);
            expect(response.text).toBeNull();
            expect(response.json.tot_teachers).toBe(0);
            expect(response.json.teachers).toEqual([]);
        });
        test("With good limit and offset", () => {
            let request = new Request();
            request.query = { limit: 2, offset: 9 };
            let response = teachers_GET(request);
            expect(response.status).toBe(200);
            expect(response.text).toBeNull();
            expect(response.json.tot_teachers).toBe(0);
            expect(response.json.teachers).toEqual([]);
        });
    });
});

describe("/teachers POST and GET", () => {
    test("Add twice and get it", () => {
        let request = new Request();
        request.body = { email: "a.b@c", first_name: "a", last_name: "b" };
        let response = teachers_POST(request);
        expect(response.status).toBe(201);
        expect(response.text).toBeNull();
        expect(response.json).toMatchObject({
            email: "a.b@c",
            first_name: "a",
            last_name: "b"
        });

        response = teachers_POST(request);
        expect(response.status).toBe(423);
        expect(response.json).toBeNull();
        expect(util.isString(response.text)).toBe(true);

        request = new Request();
        request.query = { email: "a.b@c" };
        response = teachers_GET(request);
        expect(response.status).toBe(200);
        expect(response.text).toBeNull();
        expect(response.json).toMatchObject({
            tot_teachers: 1,
            teachers: [{
                email: "a.b@c",
                first_name: "a",
                last_name: "b"
            }]
        });

        request = new Request();
        request.query = { email: "a.b@c", limit: 1, offset: 0 };
        response = teachers_GET(request);
        expect(response.status).toBe(200);
        expect(response.text).toBeNull();
        expect(response.json).toMatchObject({
            tot_teachers: 1,
            teachers: [{
                email: "a.b@c",
                first_name: "a",
                last_name: "b"
            }]
        });

        request = new Request();
        request.query = { email: "a.b@c", limit: 0 };
        response = teachers_GET(request);
        expect(response.status).toBe(200);
        expect(response.text).toBeNull();
        expect(response.json).toEqual({
            tot_teachers: 1,
            teachers: []
        });

        request = new Request();
        request.query = { email: "a.b@c", offset: 1 };
        response = teachers_GET(request);
        expect(response.status).toBe(200);
        expect(response.text).toBeNull();
        expect(response.json).toEqual({
            tot_teachers: 1,
            teachers: []
        });

        request = new Request();
        request.query = { email: "a.b@c", offset: -1 };
        response = teachers_GET(request);
        expect(response.status).toBe(400);
        expect(util.isString(response.text)).toBe(true);
        expect(response.json).toBeNull();

        request = new Request();
        request.query = { email: "a.b@c", limit: -1 };
        response = teachers_GET(request);
        expect(response.status).toBe(400);
        expect(util.isString(response.text)).toBe(true);
        expect(response.json).toBeNull();
    });
});

describe("teachers heavy POST and GET", () => {
    for (let i = 0; i < 100; i++) {
        let request = new Request();
        request.body = { email: i.toString(), first_name: "a", last_name: "b" };
        let response = teachers_POST(request);
        expect(response.status).toBe(201);
        expect(response.text).toBeNull();
        expect(util.isTeacher(response.json)).toBe(true);
    }

    let request = new Request();
    request.query = {};
    let response = teachers_GET(request);
    expect(response.status).toBe(200);
    expect(response.text).toBeNull();
    expect(response.json.tot_teachers).toBe(response.json.teachers.length);
    let teachers = response.json.teachers;
    expect(teachers.every(teach => util.isTeacher(teach))).toBe(true);

    request = new Request();
    request.query = { email: "1" };
    response = teachers_GET(request);
    expect(response.status).toBe(200);
    expect(response.text).toBeNull();
    expect(response.json.tot_teachers).toBe(1);

    request = new Request();
    request.query = { limit: "1" };
    response = teachers_GET(request);
    expect(response.status).toBe(400);

    request = new Request();
    request.query = { limit: 20 };
    response = teachers_GET(request);
    expect(response.status).toBe(200);
    expect(response.text).toBeNull();
    expect(response.json.tot_teachers >= 100).toBe(true);
    expect(response.json.teachers.length).toBe(20);

    request = new Request();
    request.query = { limit: 20, offset: 50 };
    response = teachers_GET(request);
    expect(response.status).toBe(200);
    expect(response.text).toBeNull();
    expect(response.json.tot_teachers >= 100).toBe(true);
    expect(response.json.teachers.length).toBe(20);
    teachers = response.json.teachers;
    expect(teachers.every(teach => teach.id >= 50)).toBe(true);
});

describe("teachers GET with wrong parameters", () => {
    let request = new Request();
    request.query = { email: "" };
    let response = teachers_GET(request);
    expect(response.status).toBe(400);

    request = new Request();
    request.query = { email: 1 };
    response = teachers_GET(request);
    expect(response.status).toBe(400);

    request = new Request();
    request.query = { limit: -1 };
    response = teachers_GET(request);
    expect(response.status).toBe(400);

    request = new Request();
    request.query = { offset: -1 };
    response = teachers_GET(request);
    expect(response.status).toBe(400);

    request = new Request();
    request.query = { limit: "1" };
    response = teachers_GET(request);
    expect(response.status).toBe(400);

    request = new Request();
    request.query = { offset: {} };
    response = teachers_GET(request);
    expect(response.status).toBe(400);
});

describe("teachers POST with bad parameters", () => {
    let request = new Request();
    request.body = {
        email: 1,
        first_name: "a",
        last_name: "b"
    };
    let response = teachers_POST(request);
    expect(response.status).toBe(400);
    expect(util.isString(response.text)).toBe(true);
    expect(response.json).toBeNull();

    request = new Request();
    request.body = {
        first_name: "a",
        last_name: "b"
    };
    response = teachers_POST(request);
    expect(response.status).toBe(400);
    expect(util.isString(response.text)).toBe(true);
    expect(response.json).toBeNull();

    request = new Request();
    request.body = {
        email: "",
        first_name: "a",
        last_name: "b"
    };
    response = teachers_POST(request);
    expect(response.status).toBe(400);
    expect(util.isString(response.text)).toBe(true);
    expect(response.json).toBeNull();

    request = new Request();
    request.body = {
        email: "asd",
        first_name: 1,
        last_name: "b"
    };
    response = teachers_POST(request);
    expect(response.status).toBe(400);
    expect(util.isString(response.text)).toBe(true);
    expect(response.json).toBeNull();

    request = new Request();
    request.body = {
        email: "asd",
        first_name: "a",
        last_name: null
    };
    response = teachers_POST(request);
    expect(response.status).toBe(400);
    expect(util.isString(response.text)).toBe(true);
    expect(response.json).toBeNull();
});

describe("teachers/teacherID GET", () => {
    let request = new Request();
    request.body = {
        email: "andrea.matte",
        first_name: "andrea",
        last_name: "matte"
    };
    let response = teachers_POST(request);
    let id = response.json.id;
    test("with ok param", () => {
        let request = new Request();
        request.params = { teacherID: id };
        let response = teachers_teacherID_GET(request);
        expect(response.status).toBe(200);
        expect(response.json.id).toBe(id);
    });

    test("with bad param", () => {
        let request = new Request();
        request.params = { teacherID: "asd" };
        let response = teachers_teacherID_GET(request);
        expect(response.status).toBe(404);
        expect(response.json).toBeNull();
    });

    test("with bad param", () => {
        let request = new Request();
        request.params = { teacherID: 9.2 };
        let response = teachers_teacherID_GET(request);
        expect(response.status).toBe(404);
        expect(response.json).toBeNull();
    });

    test("with non-ex id", () => {
        let request = new Request();
        request.params = { teacherID: 99999999 };
        let response = teachers_teacherID_GET(request);
        expect(response.status).toBe(404);
        expect(response.json).toBeNull();
    });
});

describe("teachers/teacherID DELETE", () => {
    let request = new Request();
    request.body = {
        email: "andrea.iossa",
        first_name: "andrea",
        last_name: "iossa"
    };
    let response = teachers_POST(request);
    let id = response.json.id;

    test("with bad param", () => {
        let request = new Request();
        request.params = { teacherID: "asd" };
        let response = teachers.teachers_teacherID_DELETE(request);
        expect(response.status).toBe(400);
        expect(response.json).toBeNull();
    });

    test("with bad param", () => {
        let request = new Request();
        request.params = { teacherID: 0.5 };
        let response = teachers.teachers_teacherID_DELETE(request);
        expect(response.status).toBe(400);
        expect(response.json).toBeNull();
    });

    test("with not existing teacherID", () => {
        let request = new Request();
        request.params = { teacherID: id + 5 };
        let response = teachers.teachers_teacherID_DELETE(request);
        expect(response.status).toBe(404);
        expect(response.json).toBeNull();
    });

    test("with ok param", () => {
        let request = new Request();
        request.params = { teacherID: id };
        let response = teachers.teachers_teacherID_DELETE(request);
        expect(response.status).toBe(204);
        expect(response.json).toBeNull();
    });

});

describe("teachers/teacherID PUT", () => {
    let request = new Request();
    let id = 83721897;
    request.params = { teacherID: id };
    request.body = {
        email: "andrea.matte2",
        first_name: "andrea",
        last_name: "matte"
    };
    let response = teachers_teacherID_PUT(request);
    expect(response.status).toBe(201);

    test("updating with good params", () => {
        let request = new Request();
        request.params = { teacherID: id };
        request.body = {
            email: "andrea.matte2",
            first_name: "asd",
            last_name: "mk"
        };
        let response = teachers_teacherID_PUT(request);
        expect(response.status).toBe(200);
    });

    test("updating with bad params", () => {
        let request = new Request();
        request.params = { teacherID: id };
        request.body = {
            email: "andrea.matte2",
            first_name: 1,
            last_name: "mk"
        };
        let response = teachers_teacherID_PUT(request);
        expect(response.status).toBe(400);
    });

    test("updating with bad params", () => {
        let request = new Request();
        request.params = { teacherID: id };
        request.body = {
            email: "andrea.matte2",
            first_name: "asd",
            last_name: null
        };
        let response = teachers_teacherID_PUT(request);
        expect(response.status).toBe(400);
    });

    test("creating with existing email", () => {
        let request = new Request();
        request.params = { teacherID: id + 2 };
        request.body = {
            email: "andrea.matte",
            first_name: "undefined",
            last_name: "null"
        };
        let response = teachers_teacherID_PUT(request);
        expect(response.status).toBe(423);
    });

    test("creating with bad params", () => {
        let request = new Request();
        request.params = { teacherID: id + 4 };
        request.body = {
            email: "andrea.matte9",
            first_name: "asd",
            last_name: null
        };
        let response = teachers_teacherID_PUT(request);
        expect(response.status).toBe(400);
    });

    test("creating with bad params", () => {
        let request = new Request();
        request.params = { teacherID: 9.2 };
        request.body = {
            email: "andrea.matte9",
            first_name: "asd",
            last_name: null
        };
        let response = teachers_teacherID_PUT(request);
        expect(response.status).toBe(400);
    });

    test("creating with bad params", () => {
        let request = new Request();
        request.params = { teacherID: id + 100 };
        request.body = {
            email: "",
            first_name: "asd",
            last_name: "be"
        };
        let response = teachers_teacherID_PUT(request);
        expect(response.status).toBe(400);
    });
});