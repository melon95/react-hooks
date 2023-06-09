import { useEffect, useRef, useState } from "react";

export type ShouldUpdateFunc<T> = (prev: T, next: T) => boolean;

const defaultShouldUpdate = <T>(pre: T, next: T) => !Object.is(pre, next);

const usePrevious = <T>(
	value: T,
	shouldUpdate: ShouldUpdateFunc<T> = defaultShouldUpdate<T>,
): T => {
	const [state, setState] = useState<T[]>([]);

	useEffect(() => {
		setState((pre) => {
			if (shouldUpdate(pre[1], value)) {
				return [pre[1], value];
			}
			return pre;
		});
	}, [value, shouldUpdate]);

	return state[0];
};

const AHooksUsePrevious = <T>(
	value: T,
	shouldUpdate: ShouldUpdateFunc<T> = defaultShouldUpdate<T>,
): T => {
	const preRef = useRef<T>();
	const curRef = useRef<T>();

	if (shouldUpdate(curRef.current, value)) {
		preRef.current = curRef.current;
		curRef.current = value;
	}

	return preRef.current;
};

export default usePrevious;
