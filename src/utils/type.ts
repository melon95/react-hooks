export const isFunction = (value: any): value is Function =>
	typeof value === "function";

export const isArray = (value: any): value is Array<any> =>
	Array.isArray(value);

const toString = Object.prototype.toString;

export const isObject = (value: any): value is Object =>
	toString.call(value) === "[object Object]";

export const isString = (value: any): value is string =>
	typeof value === "string";

export const isBoolean = (value: any): value is boolean =>
	typeof value === "boolean";

export const isNumber = (value: any): value is number =>
	typeof value === "number";
