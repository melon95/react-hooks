import { DependencyList, EffectCallback, useEffect, useRef } from "react";
import useUnmount from "../../lifeCycle/useUnmount";

const useUpdateEffect = (effect: EffectCallback, deps?: DependencyList) => {
	const isMounted = useRef(false);

	useUnmount(() => {
		isMounted.current = false;
	});

	useEffect(() => {
		if (isMounted.current) {
			return effect();
		}
		isMounted.current = true;
	}, deps);
};

export default useUpdateEffect;
