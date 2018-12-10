const router = require('express').Router();

const exams_GET = require('../models/exams/exams_GET');
const exams_POST = require('../models/exams/exams_POST');
const exams_examID_GET = require('../models/exams/exams_examID_GET');
const exams_examID_PUT = require('../models/exams/exams_examID_PUT');
const exams_examID_DELETE = require('../models/exams/exams_examID_DELETE');
const exams_examID_students_GET = require('../models/exams/exams_examID_students_GET');
const exams_examID_students_POST = require('../models/exams/exams_examID_students_POST');
const exams_examID_teachers_GET = require('../models/exams/exams_examID_teachers_GET');
const exams_examID_teachers_POST = require('../models/exams/exams_examID_teachers_POST');
const exams_examID_tasks_GET = require('../models/exams/exams_examID_tasks_GET');
const exams_examID_tasks_POST = require('../models/exams/exams_examID_tasks_POST');
const exams_examID_submissions_GET = require('../models/exams/exams_examID_submissions_GET');
const exams_examID_tasks_taskID_DELETE = require('../');
const exams_examID_teachers_teacherID_DELETE = require('../');
const exams_examID_students_studentID_DELETE = require('../');

router
    .get("/exams", (req, res) => {
        let response = exams_GET(req);
        res.status(response.status);
        res.send(response.json || response.text);
    })
    .post("/exams", (req, res) => {
        let response = exams_POST(req);
        res.status(response.status);
        res.send(response.json || response.text);
    })
    .get("/exams/:examID", (req, res) => {
        let response = exams_examID_GET(req);
        res.status(response.status);
        res.send(response.json || response.text);
    })
    .put("/exams/:examID", (req, res) => {
        let response = exams_examID_PUT(req);
        res.status(response.status);
        res.send(response.json || response.text);
    })
    .delete("/exams/:examID", (req, res) => {
        let response = exams_examID_DELETE(req);
        res.status(response.status);
        res.send(response.json || response.text);
    })
    .get("/exams/:examID/students", (req, res) => {
        let response = exams_examID_students_GET(req);
        res.status(response.status);
        res.send(response.json || response.text);
    })
    .post("/exams/:examID/students", (req, res) => {
        let response = exams_examID_students_POST(req);
        res.status(response.status);
        res.send(response.json || response.text);
    })
    .get("/exams/:examID/teachers", (req, res) => {
        let response = exams_examID_teachers_GET(req);
        res.status(response.status);
        res.send(response.json || response.text);
    })
    .post("/exams/:examID/teachers", (req, res) => {
        let response = exams_examID_teachers_POST(req);
        res.status(response.status);
        res.send(response.json || response.text);
    })
    .get("/exams/:examID/tasks", (req, res) => {
        let response = exams_examID_tasks_GET(req);
        res.status(response.status);
        res.send(response.json || response.text);
    })
    .post("/exams/:examID/tasks", (req, res) => {
        let response = exams_examID_tasks_POST(req);
        res.status(response.status);
        res.send(response.json || response.text);
    })
    .get("/exams/:examID/submissions", (req, res) => {
        let response = exams_examID_submissions_GET(req);
        res.status(response.status);
        res.send(response.json || response.text);
    });

module.exports = router;