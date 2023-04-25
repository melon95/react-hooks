import { DependencyList, useEffect } from "react";

const useAsyncEffect = <T>(
	effect: AsyncGeneratorFunction | (() => Promise<T>),
	deps?: DependencyList,
) => {
	useEffect(() => {
		const res = effect();
		let isCancel = false;

		async function helper() {
			if (res instanceof Promise) {
				await res;
			} else {
				for await (const _ of res) {
					if (isCancel) {
						break;
					}
				}
			}
		}
		helper();

		return () => {
			isCancel = true;
		};
	}, deps);
};

export default useAsyncEffect;
