import { isNumber } from "lodash-es";
import { useCallback, useEffect, useRef } from "react";
type TimeoutFn = () => void;

const useTimeout = (effect: TimeoutFn, delay: number) => {
	const effectRef = useRef<TimeoutFn>(effect);
	const timeoutRef = useRef<NodeJS.Timer>();

	const clear = useCallback(() => {
		clearTimeout(timeoutRef.current);
	}, []);

	useEffect(() => {
		if (!isNumber(delay) || delay <= 0) return;
		timeoutRef.current = setTimeout(effectRef.current, delay);
		return clear;
	}, []);

	return clear;
};

export default useTimeout;
