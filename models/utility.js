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

function Response(status, result) {
	if (arguments.length > 2 || !isInteger(status) || status < 0 || result === undefined || result === null) {
		throw new Error("Wrong response parameters");
	}
	this.status = status;
	if (isString(result)) {
		this.text = result;
	} else if (result === Object(result)) {
		this.json = result;
	} else {
		throw new Error("Wrong response parameter");
	}
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

	return true;
}

function isTask(task) {
	if (!task) return "Task is falsy";
	if (!isInteger(task.id)) return "Task id is not an integer";
	if (task.id <= 0) return "Task id is negative";

	if (!task.question) return "Question is falsy";
	if (!isString(task.question)) return "Question is not a string or an empty one";

	if (task.answers) {
		if (Object.keys(task.answers).length > 2) return "Answers has invalid number of properties";

		if (!task.answers.possible_answers) return "Possible_answers is falsy";
		if (!isArray(task.answers.possible_answers)) return "Possible_answers is not an array";
		if (task.answers.possible_answers.length < 2) return "Possible_answers must have at least two answers";
		if (!task.answers.possible_answers.every(possible_answer => isString(possible_answer))) {
			return "Some possible answers are not strings or are empty strings";
		}

		if (!task.answers.correct_answers) return "Correct_answers is falsy";
		if (!isArray(task.answers.correct_answers)) return "Correct_answers is not an array";
		if (task.answers.correct_answers.length < 1) return "There must be at least one correct answer";
		if (!task.answers.correct_answers.every(correct_answer => isInteger(correct_answer))) {
			return "Some correct_answers indices are not integers";
		}
		if (!task.answers.correct_answers.every(correct_answer => correct_answer >= 0)) {
			return "Some correct_answers indices are negative";
		}
		if (!task.answers.correct_answers.every(correct_answer => correct_answer < task.answers.possible_answers.length)) {
			return "Some correct_answers indices are out of range";
		}
	}
	if (!isInteger(task.n_votes) || task.n_votes < 0) return "N_votes is not an integer";
	if (!isNumber(task.rating)) return "Rating is not a number";
	if (task.rating < 0 || task.rating > 10) return "Rating is out of range";
	if (Object.keys(task).length !== 4 && Object.keys(task).length !== 5) return "Task has invalid number of properties";

	return true;
}

function isReview(review) {
	if (!review) return "Review is falsy";

	if (!isInteger(review.id)) return "Review id is not an integer";
	if (review.id < 1) return "Review id is not valid integer";

	if (!isInteger(review.studentID)) return "StudentID is not an integer";
	if (review.studentID < 1) return "StudentID is not valid integer";

	if (!isInteger(review.submissionID)) return "SubmissionID is not an integer";
	if (review.submissionID < 1) return "SubmissionID is not valid integer";

	if (!isInteger(review.mark)) return "Mark is not an integer";
	if (review.mark < 0 || review.mark > 30) return "Mark is out of range";

	if (Object.keys(review).length !== 4) return "Review has invalid number of properties";

	return true;
}

function isSubmission(sub) {
	if (!sub) return "Falsy value";
	if (!isInteger(sub.id) || sub.id < 1) return "Bad id body parameter";
	if (!isInteger(sub.studentID)) return "Bad studentID body parameter";
	if (!isInteger(sub.examID)) return "Bad examID body parameter";
	if (!isInteger(sub.taskID)) return "Bad taskID body parameter";
	if (sub.chosen_answers !== undefined) {
		if (!isArray(sub.chosen_answers)) return "Chosen_answer must be an array of integers";
		if (!sub.chosen_answers.every(i => isInteger(i) && i >= 0)) return "Every item in chosen_answer must be an integer";
	}
	if (sub.answer !== undefined && !isString(sub.answer)) return "Bad answer body parameter";
	if (sub.answer !== undefined && sub.chosen_answers !== undefined) return "Cannot have both answer and chosen_answers";
	if (sub.answer === undefined && sub.chosen_answers === undefined) return "Must have either answer or chosen_answers";
	return true;
}

module.exports = {
	toInt,
	isInteger,
	isString,
	isNumber,
	isStringDate,
	isArray,
	isStudent,
	isTeacher,
	isTask,
	isSubmission,
	isReview,
	isExam,
	doOffset,
	doLimit,
	doOffsetLimit,
	Request,
	Response
};
