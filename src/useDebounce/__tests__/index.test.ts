import { act, renderHook } from "@testing-library/react";
import useDebounce from "../";
import { sleep } from "../../utils/tools";

describe("useDebounce", () => {
	test("should be debounce", async () => {
		let debounceValue: number = 0;
		const { result, rerender } = renderHook(() =>
			useDebounce(debounceValue, { wait: 200 }),
		);
		expect(result.current).toBe(0);

		debounceValue = 1;
		rerender();
		await act(async () => {
			await sleep(50);
		});
		expect(result.current).toBe(0);

		debounceValue = 2;
		rerender();
		await act(async () => {
			await sleep(100);
		});
		expect(result.current).toBe(0);

		debounceValue = 3;
		rerender();
		await act(async () => {
			await sleep(150);
		});
		expect(result.current).toBe(0);

		debounceValue = 4;
		rerender();
		await act(async () => {
			await sleep(250);
		});
		expect(result.current).toBe(4);
	});
});
