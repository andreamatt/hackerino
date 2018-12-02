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