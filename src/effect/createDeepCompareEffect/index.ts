import { isEqual } from "lodash-es";
import { DependencyList, EffectCallback, useRef } from "react";

const createDeepCompareEffect = (effectFn: Function) => {
	return (effect: EffectCallback, deps?: DependencyList) => {
		const ref = useRef<DependencyList>();

		if (!isEqual(deps, ref.current)) {
			ref.current = deps;
		}

		effectFn(effect, [ref.current]);
	};
};

export default createDeepCompareEffect;
