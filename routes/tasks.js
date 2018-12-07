const router = require('express').Router();

const tasks_GET = require('../models/tasks/tasks_GET');
const tasks_POST = require('../models/tasks/tasks_POST');
const tasks_taskID_GET = require('../models/tasks/tasks_taskID_GET');
const tasks_taskID_PUT = require('../models/tasks/tasks_taskID_PUT');
const tasks_taskID_DELETE = require('../models/tasks/tasks_taskID_DELETE');
const tasks_taskID_exams_GET = require('../models/tasks/tasks_taskID_exams_GET');
const tasks_taskID_submissions_GET = require('../models/tasks/tasks_taskID_submissions_GET');
const tasks_taskID_vote_POST = require('../models/tasks/tasks_taskID_vote_POST');

router
    .get("/tasks", (req, res) => {
        let response = tasks_GET(req);
        res.status(response.status);
        res.send(response.json || response.text);
    })
    .post("/tasks", (req, res) => {
        let response = tasks_POST(req);
        res.status(response.status);
        res.send(response.json || response.text);
    })
    .get("/tasks/:taskID", (req, res) => {
        let response = tasks_taskID_GET(req);
        res.status(response.status);
        res.send(response.json || response.text);
    })
    .put("/tasks/:taskID", (req, res) => {
        let response = tasks_taskID_PUT(req);
        res.status(response.status);
        res.send(response.json || response.text);
    })
    .delete("/tasks/:taskID", (req, res) => {
        let response = tasks_taskID_DELETE(req);
        res.status(response.status);
        res.send(response.json || response.text);
    })
    .get("/tasks/:taskID/exams", (req, res) => {
        let response = tasks_taskID_exams_GET(req);
        res.status(response.status);
        res.send(response.json || response.text);
    })
    .get("/tasks/:taskID/submissions", (req, res) => {
        let response = tasks_taskID_submissions_GET(req);
        res.status(response.status);
        res.send(response.json || response.text);
    })
    .post("/tasks/:taskID/vote", (req, res) => {
        let response = tasks_taskID_reviews_GET(req);
        res.status(response.status);
        res.send(response.json || response.text);
    });

module.exports = router;