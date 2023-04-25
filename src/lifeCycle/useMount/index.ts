import { useEffect } from "react";
import { isDev, isFunction } from "../../utils";

const useMount = (callback: () => void) => {
	if (isDev) {
		if (!isFunction(callback)) {
			throw new Error(
				`useMount callback expected to be a function, but get ${typeof callback}`,
			);
		}
	}
	useEffect(() => {
		callback?.();
	}, []);
};

export default useMount;
