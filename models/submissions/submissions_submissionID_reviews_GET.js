const reviews = require('../reviews/reviews');
const util = require('../utility');
const submissions_list = require('./submissions').submissions_list;
const isInteger = Number.isInteger;
const Response = util.Response;
const doOffset = util.doOffset;
const Request = util.Request;
const doLimit = util.doLimit;
const toInt = util.toInt;



function submissions_submissionID_review_GET(req) {
    let id = toInt(req.params.id);
    let limit = toInt(req.query.limit);
    let offset = toInt(req.query.offset);

    if (!isInteger(id) || id < 1) {
        return new Response(400, "Bad id paramater");
    }
    if (!submissions_list[id]) {
        return new Response(404, "A submission with the specified submissionID was not found.");
    }

    let request = new Request();
    let reviews_list = reviews.reviews_GET(request);
    let filtered = reviews_list.filter(review => {
        return review.submissionID === id;
    });

    let tot = filtered.length;

    if (offset !== undefined) {
        if (!isInteger(offset)) {
            return new Response(400, "Bad offset query");
        }
        if (offset < 0) {
            return new Response(400, "Offset is negative");
        }
        filtered = doOffset(filtered, offset);
    }

    if (limit !== undefined) {
        if (!isInteger(limit)) {
            return new Response(400, "Bad limit query");
        }
        if (limit < 0) {
            return new Response(400, "Limit is negative");
        }
        filtered = doLimit(filtered, limit);
    }
    return new Response(200, { tot_reviews: tot, reviews: filtered });
}



module.exports = submissions_submissionID_review_GET;