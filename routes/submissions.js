const router = require('express').Router();

const submissions_GET = require('../models/submissions/submissions_GET');
const submissions_POST = require('../models/submissions/submissions_POST');
const submissions_submissionID_GET = require('../models/submissions/submissions_submissionID_GET');
const submissions_submissionID_PUT = require('../models/submissions/submissions_submissionID_PUT');
const submissions_submissionID_DELETE = require('../models/submissions/submissions_submissionID_DELETE');
const submissions_submissionID_reviews_GET = require('../models/submissions/submissions_submissionID_reviews_GET');


router
    .get("/submissions", (req, res) => {
        let response = submissions_GET(req);
        res.status(response.status);
        res.send(response.json || response.text);
    })
    .post("/submissions", (req, res) => {
        let response = submissions_POST(req);
        res.status(response.status);
        res.send(response.json || response.text);
    })
    .get("/submissions/:submissionID", (req, res) => {
        let response = submissions_submissionID_GET(req);
        res.status(response.status);
        res.send(response.json || response.text);
    })
    .put("/submissions/:submissionID", (req, res) => {
        let response = submissions_submissionID_PUT(req);
        res.status(response.status);
        res.send(response.json || response.text);
    })
    .delete("/submissions/:submissionID", (req, res) => {
        let response = submissions_submissionID_DELETE(req);
        res.status(response.status);
        res.send(response.json || response.text);
    })
    .get("/submissions/:submissionID/reviews", (req, res) => {
        let response = submissions_submissionID_reviews_GET(req);
        res.status(response.status);
        res.send(response.json || response.text);
    });

module.exports = router;