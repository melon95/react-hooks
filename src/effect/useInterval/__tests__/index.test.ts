import { act, renderHook } from "@testing-library/react";
import { sleep } from "../../../utils/tools";
import useInterval from "../index";

describe("useInterval", () => {
	test("normal delay", async () => {
		let count = 0;
		const { result } = renderHook(() =>
			useInterval(() => {
				count++;
			}, 1000),
		);
		expect(count).toBe(0);

		await sleep(200);
		expect(count).toBe(0);

		await sleep(900);
		expect(count).toBe(1);

		await sleep(1000);
		expect(count).toBe(2);

		result.current();
		await sleep(1000);
		expect(count).toBe(2);
	});

	test("dynamic delay", async () => {
		let count = 0;
		let delay = 200;
		const { result, rerender } = renderHook(() =>
			useInterval(() => {
				count++;
			}, delay),
		);

		await sleep(200);
		expect(count).toBe(1);

		delay = 500;
		act(() => {
			rerender();
		});
		await sleep(300);
		expect(count).toBe(1);

		await sleep(200);
		expect(count).toBe(2);

		await sleep(500);
		expect(count).toBe(3);

		result.current();
		await sleep(500);
		expect(count).toBe(3);
	});
});
