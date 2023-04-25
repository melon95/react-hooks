import { debounce } from "lodash-es";
import { useCallback, useEffect, useState } from "react";

interface Options {
	wait?: number;
	leading?: boolean;
	trailing?: boolean;
	maxWait?: number;
}

const useDebounce = <T>(value: T, options: Options = {}) => {
	const {
		wait = 1000,
		leading = false,
		trailing = true,
		maxWait = Number.MAX_SAFE_INTEGER,
	} = options;
	const [debounceValue, setDebounceValue] = useState<T>(value);

	const debounceCallback = useCallback(
		debounce((val: T) => setDebounceValue(val), wait, {
			leading,
			trailing,
			maxWait,
		}),
		[],
	);

	useEffect(() => {
		debounceCallback(value);
	}, [value]);

	return debounceValue;
};

export default useDebounce;
