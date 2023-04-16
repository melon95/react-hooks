import { act, renderHook } from "@testing-library/react";
import useSessionStorageState from "..";

describe("useSessionStorageState", () => {
	test("initial value", () => {
		const storageKey = "test";
		const { result } = renderHook(() =>
			useSessionStorageState(storageKey, { defaultValue: "default value" }),
		);

		expect(result.current[0]).toBe("default value");
		act(() => {
			result.current[1]("new value");
		});
		expect(result.current[0]).toBe("new value");
		expect(sessionStorage.getItem(storageKey)).toBe('"new value"');
	});

	test("get storage value", () => {
		const storageKey = "test";
		const { result } = renderHook(() => useSessionStorageState(storageKey));

		expect(result.current[0]).toBe("new value");
		expect(sessionStorage.getItem(storageKey)).toBe('"new value"');
	});

	test("remove storage value", () => {
		const storageKey = "test";
		const { result } = renderHook(() => useSessionStorageState(storageKey));

		expect(result.current[0]).toBe("new value");
		expect(sessionStorage.getItem(storageKey)).toBe('"new value"');

		act(() => {
			result.current[1]();
		});
		expect(result.current[0]).toBe(undefined);
		expect(sessionStorage.getItem(storageKey)).toBe(null);
	});

	test("save array", () => {
		const storageKey = "testArray";
		const { result } = renderHook(() =>
			useSessionStorageState<Array<number>>(storageKey, { defaultValue: [] }),
		);

		expect(result.current[0]).toEqual([]);

		act(() => {
			result.current[1]([1, 2, 3]);
		});
		expect(result.current[0]).toEqual([1, 2, 3]);
		expect(sessionStorage.getItem(storageKey)).toBe("[1,2,3]");
	});
});
