const util = require('../utility');
const submissions = require('../submissions/submissions');
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

    // delete submissions
    let sub_req = new Request();
    sub_req.params.examID = id;
    let subs = exams_examID_submissions_GET(sub_req).json.submissions;
    for (sub of subs) {
        submissions.forceDelete(sub.id);
    }

    // delete exam
    delete exams_list[id];
    delete exams_students[id];
    delete exams_teachers[id];
    delete exams_tasks[id];

    return new Response(204, "Deleted");
}



module.exports = exams_examID_DELETE;