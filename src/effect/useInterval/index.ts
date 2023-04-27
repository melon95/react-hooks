import { isNumber } from "lodash-es";
import { useCallback, useEffect, useRef } from "react";

type IntervalFn = () => void;

interface Options {
	immediate?: boolean;
}

const useInterval = (
	callback: IntervalFn,
	delay: number,
	options: Options = {},
) => {
	const callbackRef = useRef<IntervalFn>(callback);
	const intervalRef = useRef<NodeJS.Timer>();

	const clear = useCallback(() => {
		clearInterval(intervalRef.current);
	}, []);

	useEffect(() => {
		if (!isNumber(delay) || delay <= 0) return;
		if (options.immediate) {
			callbackRef.current();
		}
		intervalRef.current = setInterval(callbackRef.current, delay);
		return clear;
	}, [delay]);

	return clear;
};

export default useInterval;
