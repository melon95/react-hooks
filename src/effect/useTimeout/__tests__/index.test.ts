import { renderHook } from "@testing-library/react";
import useTimeout from "../index";

describe("useTimeout", () => {
	jest.useFakeTimers();
	jest.spyOn(global, "clearTimeout");

	test("should be clear", async () => {
		const fn = jest.fn();
		const { result } = renderHook(() => useTimeout(fn, 20));
		expect(fn).not.toBeCalled();

		jest.advanceTimersByTime(10);
		expect(fn).not.toBeCalled();

		result.current();
		jest.advanceTimersByTime(20);
		expect(clearTimeout).toBeCalledTimes(1);
		expect(fn).not.toBeCalled();
	});

	test("should be work", async () => {
		const fn = jest.fn();
		renderHook(() => useTimeout(fn, 20));
		jest.advanceTimersByTime(70);
		expect(fn).toHaveBeenCalledTimes(1);
	});
});
