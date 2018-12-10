const exams = require('./exams/exams');
const reviews = require('./reviews/reviews');
const students = require('./students/students');
const submissions = require('./submissions/submissions');
const tasks = require('./tasks/tasks');
const teachers = require('./teachers/teachers');

const students_list = {
	1: {
		id: 1,
		email: "andrea.matte@studenti.unitn.it",
		first_name: "andrea",
		last_name: "matte"
	},
	2: {
		id: 2,
		email: "andrei.diaconu@studenti.unitn.it",
		first_name: "andrei",
		last_name: "diaconu"
	},
	3: {
		id: 3,
		email: "andrea.iossa@studenti.unitn.it",
		first_name: "andrea",
		last_name: "iossa"
	},
	7: {
		id: 7,
		email: "mario.rossi@gmail.com",
		first_name: "mario",
		last_name: "rossi"
	}
};

const teachers_list = {
	1: {
		id: 1,
		email: "fabio.casati@unitn.it",
		first_name: "fabio",
		last_name: "casati"
	},
	4: {
		id: 4,
		email: "rseba@unitn.it",
		first_name: "r",
		last_name: "seba"
	},
	9: {
		id: 9,
		email: "jorge.ramirez@unitn.it",
		first_name: "jorge",
		last_name: "2018"
	}
};

const tasks_list = {
	1: {
		id: 1,
		question: "Wut color is dis?",
		answers: {
			possible_answers: ["yes", "i'm blind"],
			correct_answers: [1]
		},
		n_votes: 1324,
		rating: 9.7
	},
	2: {
		id: 2,
		question: "?",
		n_votes: 28,
		rating: 0
	},
	555: {
		id: 555,
		question: "Is yoza scarso at dota?",
		answers: {
			possible_answers: ["yes", "sure", "obviously"],
			correct_answers: [0, 1, 2]
		},
		n_votes: 0,
		rating: 0
	},
	911: {
		id: 911,
		question: "Select A and C",
		answers: {
			possible_answers: ["A", "B", "C", "D"],
			correct_answers: [0, 2]
		},
		n_votes: 9999999999,
		rating: 10
	}
};

const exams_list = {
	1: {
		id: 1,
		date: "December 17, 1995 03:24:00",
		deadline: "December 18, 1995 03:24:00",
		review_deadline: "December 19, 1995 03:24:00",
		tot_students: 3,
		tot_teachers: 0,
		tot_tasks: 2
	},
	2: {
		id: 2,
		date: "December 17, 1995 03:24:00",
		deadline: "December 18, 1995 03:24:00",
		review_deadline: "December 19, 1995 03:24:00",
		tot_students: 2,
		tot_teachers: 1,
		tot_tasks: 0
	},
	3: {
		id: 3,
		date: "December 17, 1995 03:24:00",
		deadline: "December 18, 1995 03:24:00",
		review_deadline: "December 19, 1995 03:24:00",
		tot_students: 0,
		tot_teachers: 3,
		tot_tasks: 4
	},
	4: {
		id: 4,
		date: "December 17, 1995 03:24:00",
		deadline: "December 18, 1995 03:24:00",
		review_deadline: "December 19, 1995 03:24:00",
		tot_students: 3,
		tot_teachers: 2,
		tot_tasks: 3
	}
};
const exams_students = {
	1: [3, 2, 7],
	2: [1, 3],
	3: [],
	4: [1, 2, 7]
};
const exams_teachers = {
	1: [],
	2: [4],
	3: [9, 4, 1],
	4: [1, 4]
};
const exams_tasks = {
	1: [2, 555],
	2: [],
	3: [1, 2, 555, 911],
	4: [1, 2, 911]
};

const submissions_list = {
	1: {
		id: 1,
		examID: 1,
		taskID: 2,
		studentID: 3,
		answer: "Asdjka",
		review_points: 0 + 30,
		final_points: 0
	},
	2: {
		id: 2,
		examID: 1,
		taskID: 2,
		studentID: 7,
		answer: "dsjaklj",
		review_points: 0,
		final_points: 0
	},
	3: {
		id: 3,
		examID: 4,
		taskID: 1,
		studentID: 2,
		chosen_answers: [1],
		review_points: 29 + 27,
		final_points: 0
	},
	4: {
		id: 4,
		examID: 4,
		taskID: 1,
		studentID: 7,
		chosen_answers: [0],
		review_points: 23,
		final_points: 0
	}
};

const reviews_list = {
	1: {
		id: 1,
		submissionID: 3,
		studentID: 1,
		mark: 29
	},
	2: {
		id: 2,
		submissionID: 3,
		studentID: 7,
		mark: 27
	},
	3: {
		id: 3,
		submissionID: 1,
		studentID: 2,
		mark: 0
	},
	4: {
		id: 4,
		submissionID: 1,
		studentID: 7,
		mark: 30
	},
	5: {
		id: 5,
		submissionID: 4,
		studentID: 1,
		mark: 23
	}
};

function clearObject(obj) {
	for (var key in obj) {
		if (obj.hasOwnProperty(key)) {
			delete obj[key];
		} else {
			console.log(key);
		}
	}
}

function copyFromTo(from, to) {
	for (var key in from) {
		if (from.hasOwnProperty(key)) {
			to[key] = from[key];
		}
	}
}

function resetDB() {
	clearObject(students.students_list);
	copyFromTo(students_list, students.students_list);

	clearObject(teachers.teachers_list);
	copyFromTo(teachers_list, teachers.teachers_list);

	clearObject(tasks.tasks_list);
	copyFromTo(tasks_list, tasks.tasks_list);

	clearObject(exams.exams_list);
	copyFromTo(exams_list, exams.exams_list);
	clearObject(exams.exams_students);
	copyFromTo(exams_students, exams.exams_students);
	clearObject(exams.exams_teachers);
	copyFromTo(exams_teachers, exams.exams_teachers);
	clearObject(exams.exams_tasks);
	copyFromTo(exams_tasks, exams.exams_tasks);

	clearObject(submissions.submissions_list);
	copyFromTo(submissions_list, submissions.submissions_list);

	clearObject(reviews.reviews_list);
	copyFromTo(reviews_list, reviews.reviews_list);
}

module.exports = { resetDB };