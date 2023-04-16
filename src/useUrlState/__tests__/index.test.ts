import { act, renderHook } from "@testing-library/react";
import useUrlState from "..";

describe("useUrlState", () => {
	test("have initial value workflow", () => {
		const { result } = renderHook(() => useUrlState<any>({ foo: "bar" }));
		expect(result.current[0]).toEqual({ foo: "bar" });
		expect(window.location.search).toBe("?foo=bar");
		act(() => {
			result.current[1]({ bar: "foo" });
		});
		expect(window.location.search).toBe("?bar=foo&foo=bar");
		expect(result.current[0]).toEqual({ foo: "bar", bar: "foo" });
	});

	test("no initial value workflow", () => {
		const { result } = renderHook(() => useUrlState<any>());
		expect(result.current[0]).toEqual({ foo: "bar", bar: "foo" });
		act(() => {
			result.current[1]({ bar: undefined });
		});
		expect(window.location.search).toBe("?foo=bar");
		expect(result.current[0]).toEqual({ foo: "bar" });
	});
});
