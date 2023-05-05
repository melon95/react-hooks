import { useEffect } from "react";

interface Options {
	restoreOnUnmount?: boolean;
}

const useTitle = (title: string, options: Options = {}) => {
	useEffect(() => {
		const preTitle = document.title;
		document.title = title;
		return () => {
			options.restoreOnUnmount && (document.title = preTitle);
		};
	}, [title]);
};

export default useTitle;
