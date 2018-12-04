const isInteger = Number.isInteger;

function toInt(value) {
	if (/^(\-|\+)?([0-9]+|Infinity)$/.test(value))
		return Number(value);
	return NaN;
}

/**
 * Description: checks if passed value is a NON-EMPTY STRING
*/
function isString(value) {
	return (typeof value === 'string' || value instanceof String) && value.length > 0;
}

function isNumber(value) {
	return typeof value === 'number' && isFinite(value);
}

function isStringDate(value) {
	return isString(value) && !isNaN(Date.parse(value));
}

function isArray(value) {
	if (value) {
		return typeof value === 'object' && value.constructor === Array && Array.isArray(value);
	}
	return false;
}

function isTask(task) {
	if (!task)
		return { bool: false, error: "Task is falsy" };
	if (!isInteger(task.id))
		return { bool: false, error: "Task id is not an integer" };
	if (task.id <= 0)
		return { bool: false, error: "Task id is negative" };

	if (!task.question)
		return { bool: false, error: "Question is falsy" };
	if (!isString(task.question))
		return { bool: false, error: "Question is not a string or an empty one" };

	if (task.answers) {
		if (Object.keys(task.answers).length > 2)
			return { bool: false, error: "Answers has invalid number of properties" };

		if (!task.answers.possible_answers)
			return { bool: false, error: "Possible_answers is falsy" };
		if (!isArray(task.answers.possible_answers))
			return { bool: false, error: "Possible_answers is not an array" };
		if (task.answers.possible_answers.length < 2)
			return { bool: false, error: "Possible_answers must have at least two answers" };
		if (!task.answers.possible_answers.every(possible_answer => isString(possible_answer)))
			return { bool: false, error: "Some possible answers are not strings or are empty strings" };

		if (!task.answers.correct_answers)
			return { bool: false, error: "Correct_answers is falsy" };
		if (!isArray(task.answers.correct_answers))
			return { bool: false, error: "Correct_answers is not an array" };
		if (task.answers.correct_answers.length < 1)
			return { bool: false, error: "There must be at least one correct answer" };
		if (!task.answers.correct_answers.every(correct_answer => isInteger(correct_answer)))
			return { bool: false, error: "Some correct_answers indices are not integers" };
		if (!task.answers.correct_answers.every(correct_answer => correct_answer >= 0))
			return { bool: false, error: "Some correct_answers indices are negative" };
		if (!task.answers.correct_answers.every(correct_answer => correct_answer < task.answers.possible_answers.length))
			return { bool: false, error: "Some correct_answers indices are out of range" };
	}
	if (!isInteger(task.n_votes) || task.n_votes < 0)
		return { bool: false, error: "N_votes is not an integer" };
	if (!isNumber(task.rating))
		return { bool: false, error: "Rating is not a number" };
	if (task.rating < 0 || task.rating > 10)
		return { bool: false, error: "Rating is out of range" };
	if (Object.keys(task).length !== 4 && Object.keys(task).length !== 5)
		return { bool: false, error: "Task has invalid number of properties" };

	return { bool: true, error: null };
}

function doOffset(collection, offset) {
	if (!isArray(collection) || !isInteger(offset) || offset < 0) {
		throw new Error("Bad doOffset parameters");
	}
	return collection.slice(offset);
}

function doLimit(collection, limit) {
	if (!isArray(collection) || !isInteger(limit) || limit < 0) {
		throw new Error("Bad doLimit parameters");
	}
	return collection.slice(0, limit);
}

function doOffsetLimit(collection, offset, limit) {
	if (!isArray(collection) || !isInteger(offset) || offset < 0 || !isInteger(limit) || limit < 0) {
		throw new Error("Bad doOffsetLimit parameters");
	}
	let withOffset = doOffset(collection, offset);
	return doLimit(withOffset, limit);
}

function Request() {
	this.params = {};
	this.query = {};
	this.body = {};
}

function Response(status, text, json) {
	if (arguments.length !== 3 || (!isInteger(status) || status < 0) || (!json && !isString(text)) || (json && isString(text))) {
		throw new Error("Wrong response parameters");
	}
	this.status = status;
	this.text = text;
	this.json = json;
}

function isStudent(stud) {
	if (!stud) return false;
	if (!isInteger(stud.id) || stud.id < 1) return false;
	if (!isString(stud.email)) return false;
	if (!isString(stud.first_name)) return false;
	if (!isString(stud.last_name)) return false;
	return true;
}

function isTeacher(teach) {
	if (!teach) return false;
	if (!isInteger(teach.id) || teach.id < 1) return false;
	if (!isString(teach.email)) return false;
	if (!isString(teach.first_name)) return false;
	if (!isString(teach.last_name)) return false;
	return true;
}

function isExam(exam) {
	if (!exam) return "falsy value";
	if (!isInteger(exam.id) || exam.id < 1) return "bad id";
	if (!isStringDate(exam.date)) return "bad date";
	if (!isStringDate(exam.deadline)) return "bad deadline";
	if (!isStringDate(exam.review_deadline)) return "bad review_deadline";
	if (Date.parse(exam.date) >= Date.parse(exam.deadline)) return "deadline needs to be after date";
	if (Date.parse(exam.deadline) >= Date.parse(exam.review_deadline)) return "review_deadline needs to be after deadline";

	return "ok";
}

module.exports = { toInt, isInteger, isString, isNumber, isStringDate, isArray, isStudent, isTeacher, isTask, isExam, doOffset, doLimit, doOffsetLimit, Request, Response };
