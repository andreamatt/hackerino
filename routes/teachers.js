const router = require('express').Router();

const teachers_GET = require('../models/teachers/teachers_GET');
const teachers_POST = require('../models/teachers/teachers_POST');
const teachers_teacherID_GET = require('../models/teachers/teachers_teacherID_GET');
const teachers_teacherID_PUT = require('../models/teachers/teachers_teacherID_PUT');
const teachers_teacherID_DELETE = require('../models/teachers/teachers_teacherID_DELETE');
const teachers_teacherID_exams_GET = require('../models/teachers/teachers_teacherID_exams_GET');

router
    .get("/teachers", (req, res) => {
        let response = teachers_GET(req);
        res.status(response.status);
        res.send(response.json || response.text);
    })
    .post("/teachers", (req, res) => {
        let response = teachers_POST(req);
        res.status(response.status);
        res.send(response.json || response.text);
    })
    .get("/teachers/:teacherID", (req, res) => {
        let response = teachers_teacherID_GET(req);
        res.status(response.status);
        res.send(response.json || response.text);
    })
    .put("/teachers/:teacherID", (req, res) => {
        let response = teachers_teacherID_PUT(req);
        res.status(response.status);
        res.send(response.json || response.text);
    })
    .delete("/teachers/:teacherID", (req, res) => {
        let response = teachers_teacherID_DELETE(req);
        res.status(response.status);
        res.send(response.json || response.text);
    })
    .get("/teachers/:teacherID/exams", (req, res) => {
        let response = teachers_teacherID_exams_GET(req);
        res.status(response.status);
        res.send(response.json || response.text);
    })
    .get("/teachers/:teacherID/submissions", (req, res) => {
        let response = teachers_teacherID_submissions_GET(req);
        res.status(response.status);
        res.send(response.json || response.text);
    })
    .get("/teachers/:teacherID/reviews", (req, res) => {
        let response = teachers_teacherID_reviews_GET(req);
        res.status(response.status);
        res.send(response.json || response.text);
    });

module.exports = router;