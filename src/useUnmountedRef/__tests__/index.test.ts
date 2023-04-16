import { renderHook } from "@testing-library/react";
import useUnmountedRef from "..";

describe("useUnmountedRef", () => {
	test("test useUnmountedRef", () => {
		const hook = renderHook(() => useUnmountedRef());
		expect(hook.result.current.current).toBe(false);
		hook.rerender();
		expect(hook.result.current.current).toBe(false);
		hook.unmount();
		expect(hook.result.current.current).toBe(true);
	});
});
