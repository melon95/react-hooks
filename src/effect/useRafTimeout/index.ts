import { isNumber } from "lodash-es";
import { useEffect, useRef } from "react";
import useLatest from "../../useLatest";

type RafTimeoutCallback = () => void;
interface Handler {
	id: number | NodeJS.Timer;
}

const RequestAnimationFrameIsDefined = () =>
	typeof requestAnimationFrame === "function";

const createRafTimeout = (callback: RafTimeoutCallback, delay: number) => {
	const handler: Handler = {
		id: 0,
	};
	if (RequestAnimationFrameIsDefined()) {
		const start = Date.now();
		function loop() {
			const now = Date.now();
			if (now - start >= delay) {
				callback();
			} else {
				handler.id = requestAnimationFrame(loop);
			}
		}
		handler.id = requestAnimationFrame(loop);
	} else {
		handler.id = setTimeout(callback, delay);
	}
	return handler;
};

const useRafTimeout = (effect: RafTimeoutCallback, delay: number) => {
	const callbackRef = useLatest(effect);
	const timerRef = useRef<Handler>();

	const clear = () => {
		if (timerRef.current?.id) {
			if (RequestAnimationFrameIsDefined()) {
				cancelAnimationFrame(timerRef.current.id as number);
			} else {
				clearTimeout(timerRef.current.id as NodeJS.Timer);
			}
		}
	};

	useEffect(() => {
		if (!isNumber(delay) || delay < 0) return;
		timerRef.current = createRafTimeout(() => {
			callbackRef.current();
		}, delay);
		return clear;
	}, []);

	return clear;
};

export default useRafTimeout;
