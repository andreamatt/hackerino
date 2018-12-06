const util = require('../utility');
const exam = require('./exam');
const createExam = exam.createExam;
const exams_list = exam.exams_list;
const isInteger = util.isInteger;
const isString = util.isString;
const Response = util.Response;
const toInt = util.toInt;



function exams_examID_PUT(req) {
    let id = toInt(req.params.examID);
    if (!isInteger(id) || id < 1) {
        return new Response(404, "Bad id parameter");
    }
    if (exams_list[id]) {
        let updated = createExam(id, req.body.date, req.body.deadline, req.body.review_deadline);
        if (isString(updated)) { // there is an error msg
            return new Response(400, updated);
        }
        exams_list[exam.id] = updated;
        return new Response(200, updated);
    } else {
        let created = createExam(id, req.body.date, req.body.deadline, req.body.review_deadline);
        if (isString(updated)) { // there is an error msg
            return new Response(400, updated);
        }
        exams_list[exam.id] = created;
        return new Response(201, created);
    }
}



module.exports = {
    exams_examID_PUT
};