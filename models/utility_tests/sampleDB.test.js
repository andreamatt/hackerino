const util = require('../utility');
const exams = require('../exams/exams');
const reviews = require('../reviews/reviews');
const students = require('../students/students');
const submissions = require('../submissions/submissions');
const tasks = require('../tasks/tasks');
const teachers = require('../teachers/teachers');
const resetDB = require('../sampleDB').resetDB;
const students_list = students.students_list;
const teachers_list = teachers.teachers_list;
const tasks_list = tasks.tasks_list;
const exams_list = exams.exams_list;
const exams_students = exams.exams_students;
const exams_teachers = exams.exams_teachers;
const exams_tasks = exams.exams_tasks;
const submissions_list = submissions.submissions_list;
const reviews_list = reviews.reviews_list;

beforeAll(resetDB);

describe("SampleDB testing", () => {
	test("Check students", () => {
		for (id in students_list) {
			let student = students_list[id];
			expect(student.id.toString()).toBe(id);
			expect(util.isStudent(student)).toBe(true);
			let sameEmail = Object.values(students_list).filter(s => {
				return s.email === student.email;
			});
			expect(sameEmail.length).toBe(1);
		}
	});

	test("Check teachers", () => {
		for (id in teachers_list) {
			let teacher = teachers_list[id];
			expect(teacher.id.toString()).toBe(id);
			expect(util.isTeacher(teacher)).toBe(true);
			let sameEmail = Object.values(teachers_list).filter(t => {
				return t.email === teacher.email;
			});
			expect(sameEmail.length).toBe(1);
		}
	});

	test("Check tasks", () => {
		for (id in tasks_list) {
			let task = tasks_list[id];
			expect(task.id.toString()).toBe(id);
			expect(util.isTask(task)).toBe(true);
			let sameQuestion = Object.values(tasks_list).filter(t => {
				return t.question === task.question;
			});
			expect(sameQuestion.length).toBe(1);
		}
	});

	test("Check exams", () => {
		for (id in exams_list) {
			let exam = exams_list[id];
			expect(exam.id.toString()).toBe(id);
			expect(util.isExam(exam)).toBe(true);

			expect(util.isArray(exams_students[id])).toBe(true);
			expect(exams_list[id].tot_students).toBe(exams_students[id].length);
			for (key in exams_students) {
				expect(util.isExam(exams_list[key])).toBe(true);
				for (s_id of exams_students[key]) {
					expect(util.isStudent(students_list[s_id])).toBe(true);
					let same_id = exams_students[key].filter(i => i === s_id);
					expect(same_id.length).toBe(1);
				}
			}

			expect(util.isArray(exams_teachers[id])).toBe(true);
			expect(exams_list[id].tot_teachers).toBe(exams_teachers[id].length);
			for (key in exams_teachers) {
				expect(util.isExam(exams_list[key])).toBe(true);
				for (s_id of exams_teachers[key]) {
					expect(util.isTeacher(teachers_list[s_id])).toBe(true);
					let same_id = exams_teachers[key].filter(i => i === s_id);
					expect(same_id.length).toBe(1);
				}
			}

			expect(util.isArray(exams_tasks[id])).toBe(true);
			expect(exams_list[id].tot_tasks).toBe(exams_tasks[id].length);
			for (key in exams_tasks) {
				expect(util.isExam(exams_list[key])).toBe(true);
				for (s_id of exams_tasks[key]) {
					expect(util.isTask(tasks_list[s_id])).toBe(true);
					let same_id = exams_tasks[key].filter(i => i === s_id);
					expect(same_id.length).toBe(1);
				}
			}
		}
	});

	test("Check submissions", () => {
		for (id in submissions_list) {
			let sub = submissions_list[id];
			expect(sub.id.toString()).toBe(id);
			expect(util.isSubmission(sub)).toBe(true);

			expect(students_list[sub.studentID]).toBeDefined();
			expect(tasks_list[sub.taskID]).toBeDefined();
			expect(exams_list[sub.examID]).toBeDefined();

			expect(exams_students[sub.examID].includes(sub.studentID)).toBe(true);
			expect(exams_tasks[sub.examID].includes(sub.taskID)).toBe(true);

			let same_sub = Object.values(submissions_list).filter(s => {
				return s.studentID === sub.studentID && s.taskID === sub.taskID && s.examID === sub.examID;
			});
			expect(same_sub.length).toBe(1);

			// check points
			let sum = 0;
			for (rev of Object.values(reviews_list)) {
				if (rev.submissionID.toString() === id) {
					sum += rev.mark;
				}
			}
			expect(sum).toBe(sub.review_points);
		}
	});

	test("Check reviews", () => {
		for (id in reviews_list) {
			let rev = reviews_list[id];
			expect(rev.id.toString()).toBe(id);
			expect(util.isReview(rev)).toBe(true);

			expect(students_list[rev.studentID]).toBeDefined();
			expect(submissions_list[rev.submissionID]).toBeDefined();

			let sub = submissions_list[rev.submissionID];
			expect(sub.studentID !== rev.studentID).toBe(true);

			expect(exams_students[sub.examID].includes(rev.studentID)).toBe(true);
		}
	});
});