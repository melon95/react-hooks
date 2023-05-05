import { act, renderHook } from "@testing-library/react";
import useUpdate from "..";

describe("useUpdate", () => {
	it("should update", () => {
		let count = 0;
		const hooks = renderHook(() => {
			const update = useUpdate();
			return {
				update,
				count,
				onChange: () => {
					count++;
					update();
				},
			};
		});
		expect(hooks.result.current.count).toBe(0);
		act(hooks.result.current.onChange);
		expect(hooks.result.current.count).toBe(1);
	});
	it("should return same update function", () => {
		const hooks = renderHook(() => useUpdate());
		const preUpdate = hooks.result.current;
		hooks.rerender();
		expect(hooks.result.current).toEqual(preUpdate);
	});
});
