import { MutableRefObject, useRef } from "react";
import useUnmount from "../useUnmount";

const useUnmountedRef = (): MutableRefObject<boolean> => {
	const unmountedRef = useRef<boolean>(false);

	useUnmount(() => {
		unmountedRef.current = true;
	});
	return unmountedRef;
};

export default useUnmountedRef;
