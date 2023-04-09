import { act, renderHook } from "@testing-library/react";
import useToggle from "../index";

describe("useToggle", () => {
  test("test useToggle", () => {
    const { result } = renderHook(() => useToggle("left", "right"));
    expect(result.current[0]).toBe("left");

    act(() => {
      result.current[1].setRight();
    })
    expect(result.current[0]).toBe("right");

    act(() => {
      result.current[1].setLeft();
    })
    expect(result.current[0]).toBe("left");

    act(() => {
      result.current[1].toggle();
    })
    expect(result.current[0]).toBe('right')

    act(() => {
      result.current[1].set('left');
    })
    expect(result.current[0]).toBe('left')
  })
});