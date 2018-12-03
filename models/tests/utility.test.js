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



test('Request and response utilities', () => {
	expect(new Request()).toMatchObject({
		params: {}, query: {}, body: {}
	});
	expect(new Request()).toMatchObject({
		params: {}, query: {}, body: {}
	});

	expect(() => { new Response(); }).toThrow();
	expect(() => { new Response(400, "Bad request"); }).toThrow();
	expect(() => { new Response(200, null, {}, "nothing"); }).toThrow();

	let valid = new Response(200, null, { someproperty: "somevalue" });
	expect(JSON.stringify(valid)).toBe(JSON.stringify({
		status: 200, text: null, json: {
			someproperty: "somevalue"
		}
	}));
});

test("isString", () => {
	expect(isString('asd')).toBe(true);

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

	expect(isTask().bool).toBe(false);		// no argument
	expect(isTask({}).bool).toBe(false);	// empty object
	expect(isTask(2).bool).toBe(false);		// a number
	expect(isTask(task).bool).toBe(true);	// valid task

	task.losses = 2;
	expect(isTask(task).bool).toBe(false);	// extra property
	delete task.losses;

	task.id = "1";
	expect(isTask(task).bool).toBe(false);	// id is integer

	task.id = 0;
	expect(isTask(task).bool).toBe(false);	// id is 0

	task.id = 1;
	delete task.answers;
	expect(isTask(task).bool).toBe(true);	//	open answer

	task.answers = {
		possible_answers: ["that", "what", "both", "neither"],
		correct_answers: [0, 3]
	};
	expect(isTask(task).bool).toBe(true);	// multiple choice

	delete task.answers.possible_answers;
	expect(isTask(task).bool).toBe(false);	// multipe choice but no possible answers

	task.answers.possible_answers = [1, 2, 3];
	expect(isTask(task).bool).toBe(false);	// possible answers are integers

	task.answers.possible_answers = 3;
	expect(isTask(task).bool).toBe(false);	// possible answers is integer

	task.answers.possible_answers = [];
	expect(isTask(task).bool).toBe(false);	// possible answers is empty array

	task.answers.possible_answers = ["only that"];
	expect(isTask(task).bool).toBe(false);	// only one possible answer

	task.answers.possible_answers = ["that", "what", "both", "neither"];
	delete task.answers.correct_answers;
	expect(isTask(task).bool).toBe(false);	// multipe choice but no correct answers

	task.answers.correct_answers = [2, 3];
	expect(isTask(task).bool).toBe(true);	// multiple correct answers in range

	task.answers.correct_answers = [];
	expect(isTask(task).bool).toBe(false);	// no correct answer

	task.answers.correct_answers = [0];
	expect(isTask(task).bool).toBe(true);	// only one correct answer

	task.answers.correct_answers = [-1, 0];
	expect(isTask(task).bool).toBe(false);	// negative correct answers

	task.answers.correct_answers = [-1];
	expect(isTask(task).bool).toBe(false);	// correct answer in range but 

	task.answers.correct_answers = [4, 99];
	expect(isTask(task).bool).toBe(false);	// correct answers indexes are out of range

	task.answers.correct_answers = ["1", "2", "3"];	// correct answers are strings
	expect(isTask(task).bool).toBe(false);

	task.answers.correct_answers = [0, 3, "1"];
	expect(isTask(task).bool).toBe(false);	// at least one correct answer is string

	task.answers.correct_answers = [0, 3, 99];
	expect(isTask(task).bool).toBe(false);	// at least one correct answer out of range

	task.answers.correct_answers = { list: [0, 3] };
	expect(isTask(task).bool).toBe(false);	// correct_answers is not an array

	task.answers.correct_answers = [0, 1];
	task.n_votes = 0;
	expect(isTask(task).bool).toBe(true);	// n_votes is null integer

	task.n_votes = "29";
	expect(isTask(task).bool).toBe(false);	// n_votes is string

	task.n_votes = -3;
	expect(isTask(task).bool).toBe(false);	// n_votes is negative

	task.n_votes = 121312412;
	expect(isTask(task).bool).toBe(true);	// n_votes is very big

	task.n_votes = 3.5;
	expect(isTask(task).bool).toBe(false);	// n_votes is not integer

	task.n_votes = 5;
	task.question = 23;
	expect(isTask(task).bool).toBe(false);	// question is integer

	task.question = "Are you what?";
	task.rating = "4.7";
	expect(isTask(task).bool).toBe(false);	// rating is string

	task.rating = 0.01;
	expect(isTask(task).bool).toBe(true);	// rating is number

	task.rating = -0.01;
	expect(isTask(task).bool).toBe(false);	// rating is negative

	task.rating = 2;
	expect(isTask(task).bool).toBe(true);	// rating is integer	

	task.rating = 10.01;
	expect(isTask(task).bool).toBe(false);	// rating is out of range
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