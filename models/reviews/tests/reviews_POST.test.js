const util = require('../../utility');
const Request = util.Request;
const Response = util.Response;
const isReview = util.isReview;

const reviews_GET = require('../reviews_GET');
const reviews_POST = require('../reviews_POST');

test("empty", () => { 

});
/*
test("reviews_GET after each valid POST", () => {
    let req_GET = new Request();
    let req_POST = new Request();
    req_POST.body = {
        question: "How old is Earth?",
        answers: {
            possible_answers: ["6000 years old", "about 4.5B years old", "Earth always existed"],
            correct_answers: [1]
        }
    };
    for (let i = 1; i < 100; i++) {
        req_POST.body.question = "How old is Earth?" + i;
        let res_POST = reviews_POST(req_POST);
        expect(res_POST).toBeInstanceOf(Response);
        expect(res_POST.status).toBe(201);
        expect(res_POST.json).toBeDefined();
        expect(isReview(res_POST.json)).toBe(true);

        let res_GET = reviews_GET(req_GET);
        expect(res_GET).toBeInstanceOf(Response);
        expect(res_GET.status).toBe(200);
        expect(res_GET.json).toBeDefined();
        expect(res_GET.json.tot_reviews).toBeGreaterThanOrEqual(0);
        expect(res_GET.json.reviews).toBeDefined();
        expect(res_GET.json.reviews.length).toBe(i);
        res_GET.json.reviews.every(review => {
            expect(isReview(review)).toBe(true);
        });
    }
});
*/