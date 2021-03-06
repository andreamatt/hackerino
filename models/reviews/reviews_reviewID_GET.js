const util = require("../utility");
const Response = util.Response;
const toInt = util.toInt;
const isInteger = util.isInteger;

const reviews = require("./reviews");
const reviews_list = reviews.reviews_list;

function reviews_reviewID_GET(req) {
    let reviewID = toInt(req.params.reviewID);

    if (!isInteger(reviewID)) {
        return new Response(400, "ReviewID is not an integer");
    }
    if (reviewID < 1) {
        return new Response(400, "ReviewID invalid value");
    }

    if (!reviews_list[reviewID]) {
        return new Response(404, "A review with the specified reviewID was not found");
    }

    return new Response(200, reviews_list[reviewID]);
}

module.exports = reviews_reviewID_GET;