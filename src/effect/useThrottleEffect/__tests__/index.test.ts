import { act, renderHook, RenderHookResult } from "@testing-library/react";
import { sleep } from "../../../utils/tools";
import useThrottleEffect from "../index";

let hook: RenderHookResult<void, { value: number; wait: number }>;

describe("useThrottleEffect", () => {
	test("useThrottleEffect should work", async () => {
		const mockEffect = jest.fn(() => {});
		const mockCleanUp = jest.fn(() => {});
		act(() => {
			hook = renderHook(
				({ value, wait }) =>
					useThrottleEffect(
						() => {
							mockEffect();
							return () => {
								mockCleanUp();
							};
						},
						[value],
						{ wait },
					),
				{ initialProps: { value: 1, wait: 200 } },
			);
		});

		hook.rerender({ value: 2, wait: 200 });
		await sleep(100);
		expect(mockEffect.mock.calls.length).toBe(1);
		expect(mockCleanUp.mock.calls.length).toBe(0);
		await act(async () => {
			await sleep(150);
		});
		expect(mockEffect.mock.calls.length).toBe(2);
		expect(mockCleanUp.mock.calls.length).toBe(1);

		hook.rerender({ value: 3, wait: 100 });
		await sleep(50);
		expect(mockEffect.mock.calls.length).toBe(3);
		expect(mockCleanUp.mock.calls.length).toBe(2);
		await act(async () => {
			await sleep(100);
		});
		expect(mockEffect.mock.calls.length).toBe(3);
		expect(mockCleanUp.mock.calls.length).toBe(2);
	});

	test("should cancel timeout on unmount", async () => {
		const mockEffect = jest.fn(() => {});
		const mockCleanUp = jest.fn(() => {});

		const hook = renderHook(
			(props) =>
				useThrottleEffect(
					() => {
						mockEffect();
						return () => {
							mockCleanUp();
						};
					},
					[props],
					{ wait: 200 },
				),
			{ initialProps: 0 },
		);

		await act(async () => {
			expect(mockEffect.mock.calls.length).toBe(1);
			expect(mockCleanUp.mock.calls.length).toBe(0);

			hook.rerender(1);
			await sleep(50);
			hook.unmount();

			expect(mockEffect.mock.calls.length).toBe(1);
			expect(mockCleanUp.mock.calls.length).toBe(1);
		});
	});
});
