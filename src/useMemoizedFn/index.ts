import { useCallback } from "react";
import useLatest from "../useLatest";

const useMemoizedFn = <T extends (...args: any[]) => any>(fn: T) => {
	const fnRef = useLatest(fn);

	const memoizedFn = useCallback((...args: Parameters<T>): ReturnType<T> => {
		return fnRef.current(...args);
	}, []);

	return memoizedFn;
};

export default useMemoizedFn;
