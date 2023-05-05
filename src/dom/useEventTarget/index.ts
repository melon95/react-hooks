import { useCallback, useState } from "react";
import useLatest from "../../useLatest";

interface Options {
	initialValue?: string;
	transformer?: <T>(value: string) => T;
}

const useEventTarget = (options: Options = {}) => {
	const { transformer = (v) => v, initialValue } = options;
	const [value, setValue] = useState(initialValue);

	const transformerRef = useLatest(transformer);

	const reset = useCallback(() => {
		setValue(initialValue);
	}, []);

	const onChange = useCallback(
		(event: any) => setValue(transformerRef.current(event.target.value)),
		[],
	);

	return [
		value,
		{
			reset,
			onChange,
		},
	] as const;
};

export default useEventTarget;
