const util = require('../utility');
const sub = require('./submissions');
const reviews = require('../reviews/reviews');
const exam = require('../exams/exams_examID_GET');
const exams_examID_GET = exam.exams_examID_GET;
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
    let examID = submissions_list[id].examID;
    request.params.examID = examID;
    let exam = exams_examID_GET(request).json;
    let deadlineDate = new Date(exam.deadline);
    let date = new Date();

    if (date > deadlineDate) {
        return new Response(451, "Cannot delete the submission right now: too late");
    }

    delete submissions_list[id];
    return new Response(204, "Submission removed.");
}



module.exports = submissions_submissionID_DELETE;


