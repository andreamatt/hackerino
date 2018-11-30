const util = require('../utility');
const Request = util.Request;
const Response = util.Response;



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
	expect(util.isString('asd')).toBe(true);

	expect(util.isString('')).toBe(false);
	expect(util.isString(1)).toBe(false);
	expect(util.isString(null)).toBe(false);
	expect(util.isString(false)).toBe(false);
	expect(util.isString(undefined)).toBe(false);
	expect(util.isString({})).toBe(false);
	expect(util.isString([])).toBe(false);
	expect(util.isString()).toBe(false);
});

test("isNumber", () => {
	expect(util.isNumber(-1)).toBe(true);
	expect(util.isNumber(0)).toBe(true);

	expect(util.isNumber('asd')).toBe(false);
	expect(util.isNumber(1 / 0)).toBe(false);
	expect(util.isNumber(null)).toBe(false);
	expect(util.isNumber(false)).toBe(false);
	expect(util.isNumber(undefined)).toBe(false);
	expect(util.isNumber({})).toBe(false);
	expect(util.isNumber([])).toBe(false);
	expect(util.isNumber()).toBe(false);
});

test("isStringDate", () => {
	expect(util.isStringDate('December 17, 1995 03:24:00')).toBe(true);
	expect(util.isStringDate((new Date()).toDateString())).toBe(true);

	expect(util.isStringDate('asd')).toBe(false);
	expect(util.isStringDate(-1)).toBe(false);
	expect(util.isStringDate(0)).toBe(false);
	expect(util.isStringDate('0')).toBe(true);
	expect(util.isStringDate(1 / 0)).toBe(false);
	expect(util.isStringDate(null)).toBe(false);
	expect(util.isStringDate(false)).toBe(false);
	expect(util.isStringDate(undefined)).toBe(false);
	expect(util.isStringDate({})).toBe(false);
	expect(util.isStringDate([])).toBe(false);
	expect(util.isStringDate()).toBe(false);
});

test("isArray", () => {
	expect(util.isArray([])).toBe(true);
	expect(util.isArray(["a", "b"])).toBe(true);
	expect(util.isArray([[[]]])).toBe(true);
	expect(util.isArray([{}, null, undefined])).toBe(true);

	expect(util.isArray(-1)).toBe(false);
	expect(util.isArray("asd")).toBe(false);
	expect(util.isArray(null)).toBe(false);
	expect(util.isArray(undefined)).toBe(false);
	expect(util.isArray({})).toBe(false);
	expect(util.isArray()).toBe(false);
	expect(util.isArray("Array")).toBe(false);
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

	expect(util.isTask()).toBe(false);		// no argument
	expect(util.isTask({})).toBe(false);	// empty object
	expect(util.isTask(2)).toBe(false);		// a number
	expect(util.isTask(task)).toBe(true);	// valid task

	task.losses = 2;
	expect(util.isTask(task)).toBe(false);	// extra property
	delete task.losses;

	task.id = "1";
	expect(util.isTask(task)).toBe(false);	// id is integer

	task.id = 0;
	expect(util.isTask(task)).toBe(false);	// id is 0

	task.id = 1;
	delete task.answers;
	expect(util.isTask(task)).toBe(true);	//	open answer

	task.answers = {
		possible_answers: ["that", "what", "both", "neither"],
		correct_answers: [0, 3]
	};
	expect(util.isTask(task)).toBe(true);	// multiple choice

	delete task.answers.possible_answers;
	expect(util.isTask(task)).toBe(false);	// multipe choice but no possible answers

	task.answers.possible_answers = [1, 2, 3];
	expect(util.isTask(task)).toBe(false);	// possible answers are integers

	task.answers.possible_answers = 3;
	expect(util.isTask(task)).toBe(false);	// possible answers is integer

	task.answers.possible_answers = [];
	expect(util.isTask(task)).toBe(false);	// possible answers is empty array

	task.answers.possible_answers = ["only that"];
	expect(util.isTask(task)).toBe(false);	// only one possible answer

	task.answers.possible_answers = ["that", "what", "both", "neither"];
	delete task.answers.correct_answers;
	expect(util.isTask(task)).toBe(false);	// multipe choice but no correct answers

	task.answers.correct_answers = [2, 3];
	expect(util.isTask(task)).toBe(true);	// multiple correct answers in range

	task.answers.correct_answers = [0];
	expect(util.isTask(task)).toBe(false);	// only one correct answer

	task.answers.correct_answers = [-1, 0];
	expect(util.isTask(task)).toBe(false);	// negative correct answers

	task.answers.correct_answers = [-1];
	expect(util.isTask(task)).toBe(false);	// correct answer in range but 

	task.answers.correct_answers = [4, 99];
	expect(util.isTask(task)).toBe(false);	// correct answers indexes are out of range

	task.answers.correct_answers = ["1", "2", "3"];	// correct answers are strings
	expect(util.isTask(task)).toBe(false);

	task.answers.correct_answers = [0, 3, "1"];
	expect(util.isTask(task)).toBe(false);	// at least one correct answer is string

	task.answers.correct_answers = [0, 3, 99];
	expect(util.isTask(task)).toBe(false);	// at least one correct answer out of range

	task.answers.correct_answers = [0, 1];
	task.n_votes = 0;
	expect(util.isTask(task)).toBe(true);	// n_votes is null integer

	task.n_votes = "29";
	expect(util.isTask(task)).toBe(false);	// n_votes is string

	task.n_votes = -3;
	expect(util.isTask(task)).toBe(false);	// n_votes is negative

	task.n_votes = 121312412;
	expect(util.isTask(task)).toBe(true);	// n_votes is very big

	task.n_votes = 3.5;
	expect(util.isTask(task)).toBe(false);	// n_votes is not integer

	task.n_votes = 5;
	task.question = 23;
	expect(util.isTask(task)).toBe(false);	// question is integer

	task.question = "Are you what?";
	task.rating = "4.7";
	expect(util.isTask(task)).toBe(false);	// rating is string

	task.rating = 0.01;
	expect(util.isTask(task)).toBe(true);	// rating is number

	task.rating = -0.01;
	expect(util.isTask(task)).toBe(false);	// rating is negative

	task.rating = 2;
	expect(util.isTask(task)).toBe(true);	// rating is integer	

	task.rating = 10.01;
	expect(util.isTask(task)).toBe(false);	// rating is out of range
});

test('doOffset', () => {
	expect(util.doOffset([1, {}, [1, 2], "a", 3, 4, 5], 2)).toEqual([[1, 2], "a", 3, 4, 5]);
	expect(util.doOffset([1, {}, [1, 2], "a", 3, 4, 5], 9999999)).toEqual([]);
	expect(util.doOffset([1, {}, [1, 2], "a", 3, 4, 5], 0).length).toBe(7);

	expect(() => util.doOffset([1, {}, [1, 2], "a", 3, 4, 5], -1)).toThrow();
	expect(() => util.doOffset([1, {}, [1, 2], "a", 3, 4, 5], null)).toThrow();
	expect(() => util.doOffset([1, {}, [1, 2], "a", 3, 4, 5], undefined)).toThrow();
	expect(() => util.doOffset([1, {}, [1, 2], "a", 3, 4, 5], 1 / 0)).toThrow();
	expect(() => util.doOffset([1, {}, [1, 2], "a", 3, 4, 5])).toThrow();
	expect(() => util.doOffset(null, 1)).toThrow();
	expect(() => util.doOffset("a", 1)).toThrow();
	expect(() => util.doOffset(1, 1)).toThrow();
	expect(() => util.doOffset(1, null)).toThrow();
});

test('doLimit', () => {
	expect(util.doLimit([1, {}, [1, 2], "a", 3, 4, 5], 3)).toEqual([1, {}, [1, 2]]);
	expect(util.doLimit([1, {}, [1, 2], "a", 3, 4, 5], 9999999).length).toBe(7);
	expect(util.doLimit([1, {}, [1, 2], "a", 3, 4, 5], 0)).toEqual([]);

	expect(() => util.doLimit([1, {}, [1, 2], "a", 3, 4, 5], -1)).toThrow();
	expect(() => util.doLimit([1, {}, [1, 2], "a", 3, 4, 5], null)).toThrow();
	expect(() => util.doLimit([1, {}, [1, 2], "a", 3, 4, 5], undefined)).toThrow();
	expect(() => util.doLimit([1, {}, [1, 2], "a", 3, 4, 5], 1 / 0)).toThrow();
	expect(() => util.doLimit([1, {}, [1, 2], "a", 3, 4, 5])).toThrow();
	expect(() => util.doLimit(null, 1)).toThrow();
	expect(() => util.doLimit("a", 1)).toThrow();
	expect(() => util.doLimit(1, 1)).toThrow();
	expect(() => util.doLimit(1, null)).toThrow();
});

test('doOffsetLimit', () => {
	expect(util.doOffsetLimit([1, {}, [1, 2], "a", 3, 4, 5], 2, 0)).toEqual([]);
	expect(util.doOffsetLimit([1, {}, [1, 2], "a", 3, 4, 5], 2, 1)).toEqual([[1, 2]]);
	expect(util.doOffsetLimit([1, {}, [1, 2], "a", 3, 4, 5], 2, 3)).toEqual([[1, 2], "a", 3]);
	expect(util.doOffsetLimit([1, {}, [1, 2], "a", 3, 4, 5], 0, 99999)).toEqual([1, {}, [1, 2], "a", 3, 4, 5]);
	expect(util.doOffsetLimit([1, {}, [1, 2], "a", 3, 4, 5], 0, 6)).toEqual([1, {}, [1, 2], "a", 3, 4]);
	expect(util.doOffsetLimit([1, {}, [1, 2], "a", 3, 4, 5], 99999, 99999)).toEqual([]);
	expect(util.doOffsetLimit([1, {}, [1, 2], "a", 3, 4, 5], 0, 99999).length).toBe(7);

	expect(() => util.doOffsetLimit([1, {}, [1, 2], "a", 3, 4, 5], -1, 10)).toThrow();
	expect(() => util.doOffsetLimit([1, {}, [1, 2], "a", 3, 4, 5], null, 10)).toThrow();
	expect(() => util.doOffsetLimit([1, {}, [1, 2], "a", 3, 4, 5], 10, null)).toThrow();
	expect(() => util.doOffsetLimit([1, {}, [1, 2], "a", 3, 4, 5], 10, -1)).toThrow();
	expect(() => util.doOffsetLimit([1, {}, [1, 2], "a", 3, 4, 5], undefined, 10, 10)).toThrow();
	expect(() => util.doOffsetLimit([1, {}, [1, 2], "a", 3, 4, 5], 1 / 0, 10)).toThrow();
	expect(() => util.doOffsetLimit([1, {}, [1, 2], "a", 3, 4, 5])).toThrow();
	expect(() => util.doOffsetLimit(null, 1, 1)).toThrow();
	expect(() => util.doOffsetLimit("a", 1, 1)).toThrow();
	expect(() => util.doOffsetLimit(1, 1, 1)).toThrow();
	expect(() => util.doOffsetLimit(1, null, null)).toThrow();
});