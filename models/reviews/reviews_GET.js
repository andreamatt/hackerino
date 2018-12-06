const util = require("../utility");
const Response = util.Response;
const doOffset = util.doOffset;
const doLimit = util.doLimit;
const toInt = util.toInt;
const isInteger = util.isInteger;

const reviews = require("./reviews");
const reviews_list = reviews.reviews_list;

function reviews_GET(req) {
    let reviews = Object.values(reviews_list);
    let tot_reviews = reviews.length;

    if (req.query.offset !== undefined) {
        let offset = toInt(req.query.offset);
        if (!isInteger(offset)) {
            return new Response(400, "Offset is not an integer");
        }
        if (offset < 0) {
            return new Response(400, "Offset is negative");
        }
        reviews = doOffset(reviews, offset);
    }
    if (req.query.limit !== undefined) {
        let limit = toInt(req.query.limit);
        if (!isInteger(limit)) {
            return new Response(400, "Limit is not an integer");
        }
        if (limit < 0) {
            return new Response(400, "Limit is negative");
        }
        reviews = doLimit(reviews, limit);
    }
    return new Response(200, { tot_reviews: tot_reviews, reviews: reviews });
}

module.exports = reviews_GET;