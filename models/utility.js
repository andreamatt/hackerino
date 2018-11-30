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
	if (!task) return false;
	if (Object.keys(task).length !== 4 && Object.keys(task).length !== 5) return false;
	if (!Number.isInteger(task.id) || task.id <= 0) return false;
	if (!isString(task.question)) return false;
	if (task.answers) {
		if (!isArray(task.answers.possible_answers)) return false;
		if (task.answers.possible_answers.length < 2) return false;
		if (!task.answers.possible_answers.every(possible_answer => isString(possible_answer))) return false;

		if (!isArray(task.answers.correct_answers)) return false;
		if (task.answers.correct_answers.length < 2) return false;
		if (!task.answers.correct_answers.every(correct_answer => Number.isInteger(correct_answer))) return false;
		if (!task.answers.correct_answers.every(correct_answer => correct_answer >= 0)) return false;
		if (!task.answers.correct_answers.every(correct_answer => correct_answer < task.answers.possible_answers.length)) return false;
	}
	if (!Number.isInteger(task.n_votes) || task.n_votes < 0) return false;
	if (!isNumber(task.rating)) return false;
	if (task.rating < 0 || task.rating > 10) return false;
	return true;
}

function doOffset(collection, offset) {
	if (!isArray(collection) || !isNumber(offset) || offset < 0) {
		throw new Error("Bad doOffset parameters");
	}
	return collection.slice(offset);
}

function doLimit(collection, limit) {
	if (!isArray(collection) || !isNumber(limit) || limit < 0) {
		throw new Error("Bad doLimit parameters");
	}
	return collection.slice(0, limit);
}

function doOffsetLimit(collection, offset, limit) {
	if (!isArray(collection) || !isNumber(offset) || offset < 0 || !isNumber(limit) || limit < 0) {
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
	if (arguments.length !== 3) {
		throw new Error("Wrong response parameters");
	}
	this.status = status;
	this.text = text;
	this.json = json;
}

module.exports = { isString, isNumber, isStringDate, isArray, isTask, doOffset, doLimit, doOffsetLimit, Request, Response };