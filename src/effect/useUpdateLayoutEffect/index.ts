import { DependencyList, EffectCallback, useLayoutEffect, useRef } from "react";

const useUpdateLayoutEffect = (
	effect: EffectCallback,
	deps?: DependencyList,
) => {
	const isMounted = useRef(false);
	useLayoutEffect(() => {
		if (isMounted.current) {
			return effect();
		}
		isMounted.current = true;
	}, deps);
};

export default useUpdateLayoutEffect;
