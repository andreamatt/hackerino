const util = require('./utility');
const Response = util.Response;
const isString = util.isString;
const isInteger = Number.isInteger;
const doOffset = util.doOffset;
const doLimit = util.doLimit;
////////////////////////////////////////////////////
const teachers_list = {};

function Teacher(email, first_name, last_name) {
    this.id = 1;
    while (teachers_list[this.id]) {
        this.id++;
    }
    this.email = email;
    this.first_name = first_name;
    this.last_name = last_name;
}

function teachers_GET(req) {
    let result = Object.values(teachers_list);
    let email = req.query.email;
    if (email !== undefined) {
        if (!isString(email)) {
            return new Response(400, "Bad email query", null);
        }
        result = result.filter(Teach => Teach.email === email);
    }
    let tot = result.length;
    let offset = req.query.offset;
    if (offset !== undefined) {
        if (!isInteger(offset)) {
            return new Response(400, "Bad offset query", null);
        }
        if (offset < 0) {
            return new Response(400, "Offset is negative", null);
        }
        result = doOffset(result, offset);
    }
    let limit = req.query.limit;
    if (limit !== undefined) {
        if (!isInteger(limit)) {
            return new Response(400, "Bad limit query", null);
        }
        if (limit < 0) {
            return new Response(400, "Limit is negative", null);
        }
        result = doLimit(result, limit);
    }
    return new Response(200, null, { tot_teachers: tot, teachers: result });
}

function teachers_POST(req) {
    let email = req.body.email;
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    if (!isString(email)) return new Response(400, "Bad email body parameter", null);
    if (!isString(first_name)) return new Response(400, "Bad first_name body parameter", null);
    if (!isString(last_name)) return new Response(400, "Bad last_name body parameter", null);

    let byEmail = Object.values(teachers_list).filter(Teach => Teach.email === email);
    if (byEmail.length > 0) {
        return new Response(423, "A teacher with such email already exists", null);
    }

    let Teach = new Teacher(email, first_name, last_name);
    teachers_list[Teach.id] = Teach;
    return new Response(201, null, Teach);
}

function teachers_teacherID_GET(req) {
    let id = util.toInt(req.params.teacherID);
    if (!isInteger(id)) return new Response(404, "Bad teacherID parameter", null);
    if (!teachers_list[id]) return new Response(404, "Teacher not found", null);

    return new Response(200, null, teachers_list[id]);
}

function teachers_teacherID_PUT(req) {
    let id = util.toInt(req.params.teacherID);
    let email = req.body.email;
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;

    if (!isInteger(id)) return new Response(400, "Bad id path parameter", null);
    if (!isString(email)) return new Response(400, "Bad email body parameter", null);
    if (!isString(first_name)) return new Response(400, "Bad first_name body parameter", null);
    if (!isString(last_name)) return new Response(400, "Bad last_name body parameter", null);

    if (teachers_list[id]) {
        teachers_list[id].first_name = first_name;
        teachers_list[id].last_name = last_name;
        return new Response(200, "Teacher updated", null);
    } else {
        let withEmail = Object.values(teachers_list).filter(Teach => Teach.email === email);
        if (withEmail.length > 0) {
            return new Response(423, "A teacher with such email already exists", null);
        }
        let teacher = new Teacher(email, first_name, last_name);
        teacher.id = id;
        teachers_list[id] = teacher;
        return new Response(201, "Teacher created", null);
    }
}

function teachers_teacherID_DELETE(req) {
    let id = util.toInt(req.params.teacherID);
    if (!isInteger(id)) return new Response(400, "Bad id path parameter", null);

    if (teachers_list[id]) {
        delete teachers_list[id];
        return new Response(204, "Teacher removed", null);
    } else {
        return new Response(404, "Could not remove the teacher with the specified ID (teacher not found).", null);
    }
}

module.exports = { teachers_GET, teachers_POST, teachers_teacherID_GET, teachers_teacherID_PUT, teachers_teacherID_DELETE };