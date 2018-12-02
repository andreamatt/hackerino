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

module.exports = { isString, isNumber, isStringDate, isArray, doOffset, doLimit, doOffsetLimit, Request, Response };