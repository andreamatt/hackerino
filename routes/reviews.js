const router = require('express').Router();

const reviews_GET = require('../models/reviews/reviews_GET');
const reviews_POST = require('../models/reviews/reviews_POST');
const reviews_reviewID_GET = require('../models/reviews/reviews_reviewID_GET');
const reviews_reviewID_PUT = require('../models/reviews/reviews_reviewID_PUT');
const reviews_reviewID_DELETE = require('../models/reviews/reviews_reviewID_DELETE');

router
    .get("/reviews", (req, res) => {
        let response = reviews_GET(req);
        res.status(response.status);
        res.send(response.json || response.text);
    })
    .post("/reviews", (req, res) => {
        let response = reviews_POST(req);
        res.status(response.status);
        res.send(response.json || response.text);
    })
    .get("/reviews/:reviewID", (req, res) => {
        let response = reviews_reviewID_GET(req);
        res.status(response.status);
        res.send(response.json || response.text);
    })
    .put("/reviews/:reviewID", (req, res) => {
        let response = reviews_reviewID_PUT(req);
        res.status(response.status);
        res.send(response.json || response.text);
    })
    .delete("/reviews/:reviewID", (req, res) => {
        let response = reviews_reviewID_DELETE(req);
        res.status(response.status);
        res.send(response.json || response.text);
    });

module.exports = router;