const util = require('../utility');
const sub = require('./submissions');
const reviews = require('../reviews/reviews');
const submissions_list = sub.submissions_list;
const isInteger = Number.isInteger;
const Response = util.Response;
const Request = util.Request;
const toInt = util.toInt;



function submissions_submissionID_DELETE(req) {
    let id = toInt(req.params.submissionID);
    if (!isInteger(id) || id < 1) {
        return new Response(404, "Bad parameter");
    }
    if (!submissions_list[id]) {
        return new Response(404, "Could not remove the submission with the specified submissionID (submission not found).");
    }

    let request = new Request();
    let reviews_list = reviews.reviews_GET(request);
    let filtered = reviews_list.filter(review => {
        return review.submissionID === id;
    });

    delete submissions_list[id];
    for (let entry in filtered) {
        reviews.reviews_reviewID_DELETE(entry.id);
    }

    return new Response(204, "Submission removed.");
}



module.exports = submissions_submissionID_DELETE;