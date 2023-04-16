import { throttle } from "lodash-es";
import { useCallback, useEffect, useState } from "react";

interface Options {
	wait?: number;
	leading?: boolean;
	trailing?: boolean;
}

const useThrottle = <T>(value: T, options: Options = {}) => {
	const { wait = 1000, leading = true, trailing = true } = options;

	const [throttleValue, setThrottleValue] = useState<T>(value);

	const throttleCallback = useCallback(
		throttle((val: T) => setThrottleValue(val), wait, {
			leading,
			trailing,
		}),
		[],
	);

	useEffect(() => {
		throttleCallback(value);
	}, [value]);

	return throttleValue;
};

export default useThrottle;
