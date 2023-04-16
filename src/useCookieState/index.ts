import Cookies, { CookieAttributes } from "js-cookie";
import { SetStateAction, useCallback, useState } from "react";
import { isFunction, isString } from "../utils";

interface Options extends CookieAttributes {
	defaultValue?: string | (() => string);
}

interface SetState {
	(value: SetStateAction<string | undefined>, options?: Options): void;
}

const useCookieState = (
	key: string,
	options: Options = {},
): [string | undefined, SetState] => {
	const [cookieState, setCookieState] = useState(() => {
		const result = Cookies.get(key);
		if (isString(result)) return result;

		if (isFunction(options.defaultValue)) return options.defaultValue();

		return options.defaultValue;
	});

	const updateCookieState = useCallback(
		(value: SetStateAction<string | undefined>, newOptions: Options = {}) => {
			const result = isFunction(value) ? value(cookieState!) : value;

			setCookieState(result);

			const { defaultValue, ...restOptions } = { ...options, ...newOptions };
			if (result === undefined) {
				Cookies.remove(key);
			} else {
				Cookies.set(key, result, restOptions);
			}
		},
		[key, options, cookieState],
	);

	return [cookieState, updateCookieState];
};

export default useCookieState;
