import { Dispatch, SetStateAction, useRef, useState } from "react";
import useUnmount from "../useUnmount";

const useSafeStage = <T>(initialValue: T): [T, Dispatch<SetStateAction<T>>] => {
	const [state, setState] = useState<T>(initialValue);

	const destroyRef = useRef(false);
	useUnmount(() => {
		destroyRef.current = true;
	});

	const updateState = (value: SetStateAction<T>) => {
		if (!destroyRef.current) {
			setState(value);
		}
	};

	return [state, updateState];
};

export default useSafeStage;
