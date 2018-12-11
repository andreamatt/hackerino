const util = require('../utility');
const Request = util.Request;
const Response = util.Response;
const isString = util.isString;
const isNumber = util.isNumber;
const isStringDate = util.isStringDate;
const isArray = util.isArray;
const isTask = util.isTask;
const doLimit = util.doLimit;
const doOffset = util.doOffset;
const doOffsetLimit = util.doOffsetLimit;
const isStudent = util.isStudent;
const isTeacher = util.isTeacher;
const isReview = util.isReview;
const isSubmission = util.isSubmission;
const isExam = util.isExam;
const isInteger = util.isInteger;

test("toInt function", () => {
	let toInt = util.toInt;
	expect(toInt(3)).toBe(3);
	expect(toInt("-3")).toBe(-3);
	expect(toInt("0")).toBe(0);
	expect(toInt(9.3)).toBeNaN();
	expect(toInt("9.3")).toBeNaN();
	expect(toInt(null)).toBeNaN();
	expect(toInt("Infinity")).toBe(Infinity);
	expect(toInt(Infinity)).toBe(Infinity);
});

test("isInteger", () => {
	expect(isInteger(3)).toBe(true);
	expect(isInteger(0)).toBe(true);
	expect(isInteger(-9)).toBe(true);

	expect(isInteger('3')).toBe(false);
	expect(isInteger(9.2)).toBe(false);
	expect(isInteger('9.2')).toBe(false);
	expect(isInteger([])).toBe(false);
	expect(isInteger()).toBe(false);
	expect(isInteger(null)).toBe(false);
	expect(isInteger({})).toBe(false);
	expect(isInteger(Infinity)).toBe(false);
});

test('Request and response utilities', () => {
	expect(new Request()).toMatchObject({
		params: {}, query: {}, body: {}
	});
	expect(new Request()).toMatchObject({
		params: {}, query: {}, body: {}
	});

	expect(() => new Response()).toThrow();
	expect(() => new Response(200, null)).toThrow();
	expect(() => new Response(200)).toThrow();
	expect(() => new Response(200, 1)).toThrow();

	expect(() => new Response(200, "msg", true)).toThrow();

	let valid = new Response(200, { someproperty: "somevalue" });
	expect(valid).toEqual({
		status: 200,
		json: {
			someproperty: "somevalue"
		}
	});
	valid = new Response(400, "Bad request");
	expect(valid).toEqual({
		status: 400,
		text: "Bad request"
	});
});

test("isString", () => {
	expect(isString('asd')).toBe(true);
	expect(isString('0')).toBe(true);

	expect(isString('')).toBe(false);
	expect(isString(1)).toBe(false);
	expect(isString(null)).toBe(false);
	expect(isString(false)).toBe(false);
	expect(isString(undefined)).toBe(false);
	expect(isString({})).toBe(false);
	expect(isString([])).toBe(false);
	expect(isString()).toBe(false);
});

test("isNumber", () => {
	expect(isNumber(-1)).toBe(true);
	expect(isNumber(0)).toBe(true);

	expect(isNumber('asd')).toBe(false);
	expect(isNumber(1 / 0)).toBe(false);
	expect(isNumber(null)).toBe(false);
	expect(isNumber(false)).toBe(false);
	expect(isNumber(undefined)).toBe(false);
	expect(isNumber({})).toBe(false);
	expect(isNumber([])).toBe(false);
	expect(isNumber()).toBe(false);
});

test("isStringDate", () => {
	expect(isStringDate('December 17, 1995 03:24:00')).toBe(true);
	expect(isStringDate((new Date()).toDateString())).toBe(true);

	expect(isStringDate('asd')).toBe(false);
	expect(isStringDate(-1)).toBe(false);
	expect(isStringDate(0)).toBe(false);
	expect(isStringDate('0')).toBe(true);
	expect(isStringDate(1 / 0)).toBe(false);
	expect(isStringDate(null)).toBe(false);
	expect(isStringDate(false)).toBe(false);
	expect(isStringDate(undefined)).toBe(false);
	expect(isStringDate({})).toBe(false);
	expect(isStringDate([])).toBe(false);
	expect(isStringDate()).toBe(false);
});

test("isArray", () => {
	expect(isArray([])).toBe(true);
	expect(isArray(["a", "b"])).toBe(true);
	expect(isArray([[[]]])).toBe(true);
	expect(isArray([{}, null, undefined])).toBe(true);

	expect(isArray(-1)).toBe(false);
	expect(isArray("asd")).toBe(false);
	expect(isArray(null)).toBe(false);
	expect(isArray(undefined)).toBe(false);
	expect(isArray({})).toBe(false);
	expect(isArray()).toBe(false);
	expect(isArray("Array")).toBe(false);
});

test("isTask", () => {
	let task = {
		id: 1,
		question: "What is what?",
		answers: {
			possible_answers: ["that", "what", "both", "neither"],
			correct_answers: [0, 3]
		},
		n_votes: 3,
		rating: 1.7
	};

	expect(isTask()).not.toBe(true);		// no argument
	expect(isTask({})).not.toBe(true);	// empty object
	expect(isTask(2)).not.toBe(true);		// a number
	expect(isTask(task)).toBe(true);	// valid task

	task.losses = 2;
	expect(isTask(task)).not.toBe(true);	// extra property
	delete task.losses;

	task.id = "1";
	expect(isTask(task)).not.toBe(true);	// id is integer

	task.id = 0;
	expect(isTask(task)).not.toBe(true);	// id is 0

	task.id = 1;
	delete task.answers;
	expect(isTask(task)).toBe(true);	//	open answer

	task.answers = {
		possible_answers: ["that", "what", "both", "neither"],
		correct_answers: [0, 3]
	};
	expect(isTask(task)).toBe(true);	// multiple choice

	task.answers.color = 'red';
	expect(isTask(task)).not.toBe(true);
	delete task.answers['color'];

	delete task.answers.possible_answers;
	expect(isTask(task)).not.toBe(true);	// multipe choice but no possible answers

	task.answers.possible_answers = [1, 2, 3];
	expect(isTask(task)).not.toBe(true);	// possible answers are integers

	task.answers.possible_answers = 3;
	expect(isTask(task)).not.toBe(true);	// possible answers is integer

	task.answers.possible_answers = [];
	expect(isTask(task)).not.toBe(true);	// possible answers is empty array

	task.answers.possible_answers = ["only that"];
	expect(isTask(task)).not.toBe(true);	// only one possible answer

	task.answers.possible_answers = ["that", "what", "both", "neither"];
	delete task.answers.correct_answers;
	expect(isTask(task)).not.toBe(true);	// multipe choice but no correct answers

	task.answers.correct_answers = [2, 3];
	expect(isTask(task)).toBe(true);	// multiple correct answers in range

	task.answers.correct_answers = [];
	expect(isTask(task)).not.toBe(true);	// no correct answer

	task.answers.correct_answers = [0];
	expect(isTask(task)).toBe(true);	// only one correct answer

	task.answers.correct_answers = [-1, 0];
	expect(isTask(task)).not.toBe(true);	// negative correct answers

	task.answers.correct_answers = [-1];
	expect(isTask(task)).not.toBe(true);	// correct answer in range but 

	task.answers.correct_answers = [4, 99];
	expect(isTask(task)).not.toBe(true);	// correct answers indexes are out of range

	task.answers.correct_answers = ["1", "2", "3"];	// correct answers are strings
	expect(isTask(task)).not.toBe(true);

	task.answers.correct_answers = [0, 3, "1"];
	expect(isTask(task)).not.toBe(true);	// at least one correct answer is string

	task.answers.correct_answers = [0, 3, 99];
	expect(isTask(task)).not.toBe(true);	// at least one correct answer out of range

	task.answers.correct_answers = { list: [0, 3] };
	expect(isTask(task)).not.toBe(true);	// correct_answers is not an array

	task.answers.correct_answers = [0, 1];
	task.n_votes = 0;
	expect(isTask(task)).toBe(true);	// n_votes is null integer

	task.n_votes = "29";
	expect(isTask(task)).not.toBe(true);	// n_votes is string

	task.n_votes = -3;
	expect(isTask(task)).not.toBe(true);	// n_votes is negative

	task.n_votes = 121312412;
	expect(isTask(task)).toBe(true);	// n_votes is very big

	task.n_votes = 3.5;
	expect(isTask(task)).not.toBe(true);	// n_votes is not integer

	task.n_votes = 5;
	task.question = 23;
	expect(isTask(task)).not.toBe(true);	// question is integer

	task.question = undefined;
	expect(isTask(task)).not.toBe(true);

	task.question = "Are you what?";
	expect(isTask(task)).toBe(true);
	task.rating = "4.7";
	expect(isTask(task)).not.toBe(true);	// rating is string

	task.rating = 0.01;
	expect(isTask(task)).toBe(true);	// rating is number

	task.rating = -0.01;
	expect(isTask(task)).not.toBe(true);	// rating is negative

	task.rating = 2;
	expect(isTask(task)).toBe(true);	// rating is integer	

	task.rating = 10.01;
	expect(isTask(task)).not.toBe(true);	// rating is out of range
});

test('doOffset', () => {
	expect(doOffset([1, {}, [1, 2], "a", 3, 4, 5], 2)).toEqual([[1, 2], "a", 3, 4, 5]);
	expect(doOffset([1, {}, [1, 2], "a", 3, 4, 5], 9999999)).toEqual([]);
	expect(doOffset([1, {}, [1, 2], "a", 3, 4, 5], 0).length).toBe(7);

	expect(() => doOffset([1, {}, [1, 2], "a", 3, 4, 5], -1)).toThrow();
	expect(() => doOffset([1, {}, [1, 2], "a", 3, 4, 5], null)).toThrow();
	expect(() => doOffset([1, {}, [1, 2], "a", 3, 4, 5], undefined)).toThrow();
	expect(() => doOffset([1, {}, [1, 2], "a", 3, 4, 5], 1 / 0)).toThrow();
	expect(() => doOffset([1, {}, [1, 2], "a", 3, 4, 5])).toThrow();
	expect(() => doOffset(null, 1)).toThrow();
	expect(() => doOffset("a", 1)).toThrow();
	expect(() => doOffset(1, 1)).toThrow();
	expect(() => doOffset(1, null)).toThrow();
});

test('doLimit', () => {
	expect(doLimit([1, {}, [1, 2], "a", 3, 4, 5], 3)).toEqual([1, {}, [1, 2]]);
	expect(doLimit([1, {}, [1, 2], "a", 3, 4, 5], 9999999).length).toBe(7);
	expect(doLimit([1, {}, [1, 2], "a", 3, 4, 5], 0)).toEqual([]);

	expect(() => doLimit([1, {}, [1, 2], "a", 3, 4, 5], -1)).toThrow();
	expect(() => doLimit([1, {}, [1, 2], "a", 3, 4, 5], null)).toThrow();
	expect(() => doLimit([1, {}, [1, 2], "a", 3, 4, 5], undefined)).toThrow();
	expect(() => doLimit([1, {}, [1, 2], "a", 3, 4, 5], 1 / 0)).toThrow();
	expect(() => doLimit([1, {}, [1, 2], "a", 3, 4, 5])).toThrow();
	expect(() => doLimit(null, 1)).toThrow();
	expect(() => doLimit("a", 1)).toThrow();
	expect(() => doLimit(1, 1)).toThrow();
	expect(() => doLimit(1, null)).toThrow();
});

test('doOffsetLimit', () => {
	expect(doOffsetLimit([1, {}, [1, 2], "a", 3, 4, 5], 2, 0)).toEqual([]);
	expect(doOffsetLimit([1, {}, [1, 2], "a", 3, 4, 5], 2, 1)).toEqual([[1, 2]]);
	expect(doOffsetLimit([1, {}, [1, 2], "a", 3, 4, 5], 2, 3)).toEqual([[1, 2], "a", 3]);
	expect(doOffsetLimit([1, {}, [1, 2], "a", 3, 4, 5], 0, 99999)).toEqual([1, {}, [1, 2], "a", 3, 4, 5]);
	expect(doOffsetLimit([1, {}, [1, 2], "a", 3, 4, 5], 0, 6)).toEqual([1, {}, [1, 2], "a", 3, 4]);
	expect(doOffsetLimit([1, {}, [1, 2], "a", 3, 4, 5], 99999, 99999)).toEqual([]);
	expect(doOffsetLimit([1, {}, [1, 2], "a", 3, 4, 5], 0, 99999).length).toBe(7);

	expect(() => doOffsetLimit([1, {}, [1, 2], "a", 3, 4, 5], -1, 10)).toThrow();
	expect(() => doOffsetLimit([1, {}, [1, 2], "a", 3, 4, 5], null, 10)).toThrow();
	expect(() => doOffsetLimit([1, {}, [1, 2], "a", 3, 4, 5], 10, null)).toThrow();
	expect(() => doOffsetLimit([1, {}, [1, 2], "a", 3, 4, 5], 10, -1)).toThrow();
	expect(() => doOffsetLimit([1, {}, [1, 2], "a", 3, 4, 5], undefined, 10, 10)).toThrow();
	expect(() => doOffsetLimit([1, {}, [1, 2], "a", 3, 4, 5], 1 / 0, 10)).toThrow();
	expect(() => doOffsetLimit([1, {}, [1, 2], "a", 3, 4, 5])).toThrow();
	expect(() => doOffsetLimit(null, 1, 1)).toThrow();
	expect(() => doOffsetLimit("a", 1, 1)).toThrow();
	expect(() => doOffsetLimit(1, 1, 1)).toThrow();
	expect(() => doOffsetLimit(1, null, null)).toThrow();
});


test("isStudent", () => {
	let stud = {
		id: 1,
		email: "andrea@mat",
		first_name: "andrea",
		last_name: "matte"
	};
	expect(isStudent(stud)).toBe(true);
	stud.id = -1;
	expect(isStudent(stud)).toBe(false);
	stud.id = 0;
	expect(isStudent(stud)).toBe(false);
	stud.id = "asd";
	expect(isStudent(stud)).toBe(false);
	stud.id = null;
	expect(isStudent(stud)).toBe(false);
	delete stud["id"];
	expect(isStudent(stud)).toBe(false);
	stud.id = undefined;
	expect(isStudent(stud)).toBe(false);
	stud.id = "1";
	expect(isStudent(stud)).toBe(false);
	stud.id = 1;
	stud.email = undefined;
	expect(isStudent(stud)).toBe(false);
	delete stud["email"];
	expect(isStudent(stud)).toBe(false);
	stud.email = null;
	expect(isStudent(stud)).toBe(false);
	stud.email = 123;
	expect(isStudent(stud)).toBe(false);
	stud.email = "";
	expect(isStudent(stud)).toBe(false);
	stud.email = "a.b@c";
	stud.first_name = null;
	expect(isStudent(stud)).toBe(false);
	stud.first_name = undefined;
	expect(isStudent(stud)).toBe(false);
	stud.first_name = "asd";
	stud.last_name = null;
	expect(isStudent(stud)).toBe(false);
	stud.last_name = "b";
	expect(isStudent(stud)).toBe(true);
	expect(isStudent(null)).toBe(false);
	expect(isStudent()).toBe(false);
	expect(isStudent([])).toBe(false);
	expect(isStudent({})).toBe(false);
	expect(isStudent(1)).toBe(false);
	expect(isStudent(JSON.stringify(stud))).toBe(false);
});

test("isTeacher", () => {
	let teach = {
		id: 1,
		email: "andrea@iossa",
		first_name: "andrea",
		last_name: "iossa"
	};
	expect(isTeacher(teach)).toBe(true);
	teach.id = -1;
	expect(isTeacher(teach)).toBe(false);
	teach.id = 0;
	expect(isTeacher(teach)).toBe(false);
	teach.id = "asd";
	expect(isTeacher(teach)).toBe(false);
	teach.id = null;
	expect(isTeacher(teach)).toBe(false);
	delete teach["id"];
	expect(isTeacher(teach)).toBe(false);
	teach.id = undefined;
	expect(isTeacher(teach)).toBe(false);
	teach.id = "1";
	expect(isTeacher(teach)).toBe(false);
	teach.id = 1;
	teach.email = undefined;
	expect(isTeacher(teach)).toBe(false);
	delete teach["email"];
	expect(isTeacher(teach)).toBe(false);
	teach.email = null;
	expect(isTeacher(teach)).toBe(false);
	teach.email = 123;
	expect(isTeacher(teach)).toBe(false);
	teach.email = "";
	expect(isTeacher(teach)).toBe(false);
	teach.email = "a.b@c";
	teach.first_name = null;
	expect(isTeacher(teach)).toBe(false);
	teach.first_name = undefined;
	expect(isTeacher(teach)).toBe(false);
	teach.first_name = "asd";
	teach.last_name = null;
	expect(isTeacher(teach)).toBe(false);
	teach.last_name = "b";
	expect(isTeacher(teach)).toBe(true);
	expect(isTeacher(null)).toBe(false);
	expect(isTeacher()).toBe(false);
	expect(isTeacher([])).toBe(false);
	expect(isTeacher({})).toBe(false);
	expect(isTeacher(1)).toBe(false);
	expect(isTeacher(JSON.stringify(teach))).toBe(false);
});

test("isReview", () => {
	let review = {
		id: 1,
		studentID: 1,
		submissionID: 1,
		mark: 29
	};
	expect(isReview(review)).toBe(true);
	review.id = 0;
	expect(isReview(review)).not.toBe(true);
	review.id = -1;
	expect(isReview(review)).not.toBe(true);
	review.id = "asd";
	expect(isReview(review)).not.toBe(true);
	review.id = null;
	expect(isReview(review)).not.toBe(true);
	delete review.id;
	expect(isReview(review)).not.toBe(true);
	review.id = undefined;
	expect(isReview(review)).not.toBe(true);
	review.id = 1.1;
	expect(isReview(review)).not.toBe(true);
	review.id = 1;
	review.studentID = 0;
	expect(isReview(review)).not.toBe(true);
	review.studentID = -1;
	expect(isReview(review)).not.toBe(true);
	review.studentID = "1";
	expect(isReview(review)).not.toBe(true);
	review.studentID = 30000;
	expect(isReview(review)).toBe(true);
	delete review.studentID;
	expect(isReview(review)).not.toBe(true);
	review.studentID = 30.9;
	expect(isReview(review)).not.toBe(true);
	review.studentID = 1;
	review.submissionID = 0;
	expect(isReview(review)).not.toBe(true);
	review.submissionID = -1;
	expect(isReview(review)).not.toBe(true);
	review.submissionID = 30.5;
	expect(isReview(review)).not.toBe(true);
	review.submissionID = "one";
	expect(isReview(review)).not.toBe(true);
	review.submissionID = null;
	expect(isReview(review)).not.toBe(true);
	delete review.submissionID;
	expect(isReview(review)).not.toBe(true);
	review.submissionID = 1;
	review.mark = 0;
	expect(isReview(review)).toBe(true);
	review.mark = 25.5;
	expect(isReview(review)).not.toBe(true);
	review.mark = 31;
	expect(isReview(review)).not.toBe(true);
	review.mark = -1;
	expect(isReview(review)).not.toBe(true);
	review.mark = "mark";
	expect(isReview(review)).not.toBe(true);
	delete review.mark;
	expect(isReview(review)).not.toBe(true);
	review.mark = 29;
	expect(isReview(review)).toBe(true);
	review.comment = "nice";
	expect(isReview(review)).not.toBe(true);
	delete review.comment;
	expect(isReview(null)).not.toBe(true);
	expect(isReview()).not.toBe(true);
	expect(isReview([])).not.toBe(true);
	expect(isReview({})).not.toBe(true);
	expect(isReview(1)).not.toBe(true);
	expect(isReview(JSON.stringify(review))).not.toBe(true);
});

test("isSubmission", () => {
	let sub = {
		id: 1,
		studentID: 9,
		examID: 19,
		taskID: 7,
		chosen_answers: [0, 1]
	};
	expect(isSubmission(sub)).toBe(true);

	delete sub['chosen_answers'];
	expect(isSubmission(sub)).not.toBe(true);

	sub.answer = "Heh";
	expect(isSubmission(sub)).toBe(true);
	sub.answer = "";
	expect(isSubmission(sub)).not.toBe(true);
	sub.answer = 9;
	expect(isSubmission(sub)).not.toBe(true);
	delete sub['answer'];
	expect(isSubmission(sub)).not.toBe(true);
	sub.answer = 'halo';

	sub.id = "1";
	expect(isSubmission(sub)).not.toBe(true);
	sub.id = 0;
	expect(isSubmission(sub)).not.toBe(true);
	sub.id = null;
	expect(isSubmission(sub)).not.toBe(true);
	sub.id = 1;
	sub.studentID = "1";
	expect(isSubmission(sub)).not.toBe(true);
	sub.studentID = 0;
	expect(isSubmission(sub)).not.toBe(true);
	sub.studentID = 1;
	expect(isSubmission(sub)).toBe(true);

	sub.examID = "1";
	expect(isSubmission(sub)).not.toBe(true);
	delete sub['examID'];
	expect(isSubmission(sub)).not.toBe(true);
	sub.examID = 0;
	expect(isSubmission(sub)).not.toBe(true);
	sub.examID = 1;
	sub.taskID = "1";
	expect(isSubmission(sub)).not.toBe(true);
	sub.taskID = 0;
	expect(isSubmission(sub)).not.toBe(true);
	delete sub['taskID'];
	expect(isSubmission(sub)).not.toBe(true);
	sub.taskID = 1;
	expect(isSubmission(sub)).toBe(true);

	sub.chosen_answers = [0, 1];
	expect(isSubmission(sub)).not.toBe(true);
	delete sub['answer'];
	expect(isSubmission(sub)).toBe(true);

	sub.chosen_answers = ["no", 1];
	expect(isSubmission(sub)).not.toBe(true);
	sub.chosen_answers = [1, {}];
	expect(isSubmission(sub)).not.toBe(true);
	sub.chosen_answers = "[0, 1]";
	expect(isSubmission(sub)).not.toBe(true);


	sub = {};
	expect(isSubmission(sub)).not.toBe(true);
	sub = null;
	expect(isSubmission(sub)).not.toBe(true);
	sub = undefined;
	expect(isSubmission(sub)).not.toBe(true);
});

test("isExam", () => {
	let exam = {
		id: 4,
		date: "1999/10/10",
		deadline: "1999/10/20",
		review_deadline: "1999/10/30",
		tot_students: 3,
		tot_teachers: 2,
		tot_tasks: 3
	};
	expect(isExam(exam)).toBe(true);

	exam = {
		id: 4,
		date: "1999/10/10",
		deadline: "1999/10/20",
		review_deadline: "1999/10/30"
	};
	expect(isExam(exam)).toBe(true);

	exam.deadline = "1999/10/09";
	expect(isExam(exam)).not.toBe(true);
	exam.deadline = "1999/10/20";
	exam.review_deadline = "1999/10/15";
	expect(isExam(exam)).not.toBe(true);
	exam.review_deadline = "1999/10/30";
	exam.id = "1";
	expect(isExam(exam)).not.toBe(true);
	exam.id = 0;
	expect(isExam(exam)).not.toBe(true);
	exam.id = undefined;
	expect(isExam(exam)).not.toBe(true);
	exam.id = 1;
	expect(isExam(exam)).toBe(true);

	exam.date = "?";
	expect(isExam(exam)).not.toBe(true);
	exam.date = "1999/10/10";
	exam.deadline = "asd";
	expect(isExam(exam)).not.toBe(true);
	exam.deadline = "1999/10/20";
	exam.review_deadline = "theyear1992";
	expect(isExam(exam)).not.toBe(true);
	exam.review_deadline = "1999/10/30";
	expect(isExam(exam)).toBe(true);

	exam = {};
	expect(isExam(exam)).not.toBe(true);
	exam = null;
	expect(isExam(exam)).not.toBe(true);
	exam = undefined;
	expect(isExam(exam)).not.toBe(true);
});