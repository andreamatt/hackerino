const router = require('express').Router();


const students_GET = require('../models/students/students_GET');
const students_POST = require('../models/students/students_POST');
const students_studentID_GET = require('../models/students/students_studentID_GET');
const students_studentID_PUT = require('../models/students/students_studentID_PUT');
const students_studentID_DELETE = require('../models/students/students_studentID_DELETE');
const students_studentID_exams_GET = require('../models/students/students_studentID_exams_GET');
const students_studentID_submissions_GET = require('../models/students/students_studentID_submissions_GET');
const students_studentID_reviews_GET = require('../models/students/students_studentID_reviews_GET');

router
    .get("/students", (req, res) => {
        let response = students_GET(req);
        res.status(response.status);
        res.send(response.json || response.text);
    })
    .post("/students", (req, res) => {
        let response = students_POST(req);
        res.status(response.status);
        res.send(response.json || response.text);
    })
    .get("/students/:studentID", (req, res) => {
        let response = students_studentID_GET(req);
        res.status(response.status);
        res.send(response.json || response.text);
    })
    .put("/students/:studentID", (req, res) => {
        let response = students_studentID_PUT(req);
        res.status(response.status);
        res.send(response.json || response.text);
    })
    .delete("/students/:studentID", (req, res) => {
        let response = students_studentID_DELETE(req);
        res.status(response.status);
        res.send(response.json || response.text);
    })
    .get("/students/:studentID/exams", (req, res) => {
        let response = students_studentID_exams_GET(req);
        res.status(response.status);
        res.send(response.json || response.text);
    })
    .get("/students/:studentID/submissions", (req, res) => {
        let response = students_studentID_submissions_GET(req);
        res.status(response.status);
        res.send(response.json || response.text);
    })
    .get("/students/:studentID/reviews", (req, res) => {
        let response = students_studentID_reviews_GET(req);
        res.status(response.status);
        res.send(response.json || response.text);
    });

module.exports = router;