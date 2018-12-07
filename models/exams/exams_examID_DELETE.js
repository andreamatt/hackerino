const util = require('../utility');
const submissions_submissionID_DELETE = require('../submissions/submissions_submissionID_DELETE');
const exams_examID_submissions_GET = require('./exams_examID_submissions_GET');
const exams = require('./exams');
const exams_students = exams.exams_students;
const exams_teachers = exams.exams_teachers;
const exams_tasks = exams.exams_tasks;
const exams_list = exams.exams_list;
const isInteger = util.isInteger;
const Response = util.Response;
const toInt = util.toInt;



function exams_examID_DELETE(req) {
    let id = toInt(req.params.examID);
    if (!isInteger(id) || id < 1) {
        return new Response(404, "Bad id parameter");
    }
    if (!exams_list[id]) {
        return new Response(404, "Exam not found");
    }
    // delete exam
    delete exams_list[id];
    delete exams_students[id];
    delete exams_teachers[id];
    delete exams_tasks[id];

    // delete submissions
    let sub_req = new Request();
    sub_req.params.examID = id;
    let filtered_subs = exams_examID_submissions_GET(sub_req).submissions;
    for (sub of filtered_subs) {
        let req = new Request();
        req.params.submissionID = sub.id;
        submissions_submissionID_DELETE(req);
    }

    return new Response(204, "Deleted");
}



module.exports = exams_examID_DELETE;