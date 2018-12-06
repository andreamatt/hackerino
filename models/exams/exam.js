const util = require('../utility');
const isExam = util.isExam;

const exams_list = {
	/*
	1: {
		id: 1,
		date: "December 17, 1995 03:24:00",
		deadline: "December 17, 1995 03:24:00",
		review_deadline: "December 17, 1995 03:24:00",
		tot_students: 1,
		tot_teachers: 1,
		tot_tasks: 1
	}
	*/
};
const exams_students = {
	/*
	1: [2, 98, 15],
	3: [5, 63, 15]
	*/
};
const exams_teachers = {
	/*
	1: [2, 98, 15],
	3: [5, 63, 15]
	*/
};
const exams_tasks = {
	/*
	1: [2, 98, 15],
	3: [5, 63, 15]
	*/
};

function Exam(date, deadline, review_deadline) {
    this.id = 1;
    while (exams_list[this.id]) {
        this.id++;
    }
    this.date = date;
    this.deadline = deadline;
    this.review_deadline = review_deadline;
    this.tot_students = 0;
    this.tot_teachers = 0;
    this.tot_tasks = 0;
}

function createExam(id, date, deadline, review_deadline) {
    let exam = new Exam(date, deadline, review_deadline);
    if (id !== undefined && id !== null) {
        exam.id = id;
    }
    let msg = isExam(exam);
    if (msg !== "ok") {
        return msg;
    }

    return exam;
}

module.exports = {
    Exam,
    createExam,
    exams_list,
    exams_students,
    exams_teachers,
    exams_tasks
};