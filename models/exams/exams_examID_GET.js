const util = require('../utility');
const exam = require('./exam');
const exams_list = exam.exams_list;
const isInteger = util.isInteger;
const Response = util.Response;
const toInt = util.toInt;



function exams_examID_GET(req) {
    let id = toInt(req.params.examID);
    if (!isInteger(id) || id < 1) {
        return new Response(404, "Bad id parameter");
    }
    if (!exams_list[id]) {
        return new Response(404, "Exam not found");
    }
    return new Response(200, exams_list[id]);
}



module.exports = {
    exams_examID_GET
};