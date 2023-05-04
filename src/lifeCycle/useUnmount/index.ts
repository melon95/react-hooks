import { useEffect } from "react";
import useLatest from "../../useLatest";
import { isDev, isFunction } from "../../utils";

const useUnmount = (callback: () => void) => {
	if (isDev) {
		if (!isFunction(callback)) {
			throw new Error(
				`useUnmount callback expected to be a function, but get ${typeof callback}`,
			);
		}
	}
	const callbackRef = useLatest(callback);
	useEffect(() => {
		return () => {
			callbackRef.current?.();
		};
	}, []);
};

export default useUnmount;
