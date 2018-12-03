const isInteger = Number.isInteger;

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
		return { bool: false, error: "task is falsy" };
	if (!isInteger(task.id))
		return { bool: false, error: "task id is not an integer" };
	if (task.id <= 0)
		return { bool: false, error: "task id is negative" };

	if (!task.question)
		return { bool: false, error: "question is falsy" };
	if (!isString(task.question))
		return { bool: false, error: "question is not a string or an empty one" };

	if (task.answers) {
		if (!task.answers.possible_answers)
			return { bool: false, error: "possible_answers is falsy" };
		if (Object.keys(task.answers).length > 2)
			return { bool: false, error: "answers has invalid number of properties" };

		if (!isArray(task.answers.possible_answers))
			return { bool: false, error: "possible_answers is not an array" };
		if (task.answers.possible_answers.length < 2)
			return { bool: false, error: "possible_answers must have at least two answers" };
		if (!task.answers.possible_answers.every(possible_answer => isString(possible_answer)))
			return { bool: false, error: "some possible answers are not strings or are empty strings" };

		if (!task.answers.correct_answers)
			return { bool: false, error: "correct_answers is falsy" };
		if (!isArray(task.answers.correct_answers))
			return { bool: false, error: "correct_answers is not an array" };
		if (task.answers.correct_answers.length < 1)
			return { bool: false, error: "there must be at least one correct answer" };
		if (!task.answers.correct_answers.every(correct_answer => isInteger(correct_answer)))
			return { bool: false, error: "some correct_answers indices are not integers" };
		if (!task.answers.correct_answers.every(correct_answer => correct_answer >= 0))
			return { bool: false, error: "some correct_answers indices are negative" };
		if (!task.answers.correct_answers.every(correct_answer => correct_answer < task.answers.possible_answers.length))
			return { bool: false, error: "some correct_answers indices are out of range" };
	}
	if (!isInteger(task.n_votes) || task.n_votes < 0)
		return { bool: false, error: "n_votes is not an integer" };
	if (!isNumber(task.rating))
		return { bool: false, error: "rating is not a number" };
	if (task.rating < 0 || task.rating > 10)
		return { bool: false, error: "rating is out of range" };
	if (Object.keys(task).length !== 4 && Object.keys(task).length !== 5)
		return { bool: false, error: "task has invalid number of properties" };

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

module.exports = { isInteger, isString, isNumber, isStringDate, isArray, isStudent, doOffset, doLimit, doOffsetLimit, Request, Response };
