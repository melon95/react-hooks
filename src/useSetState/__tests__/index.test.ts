import { act, renderHook } from "@testing-library/react";
import useSetState from "../index";

describe("useSetState", () => {
  test('test useSetState', () => {
    const { result } = renderHook(() => useSetState({ name: 'xiaoming', age: 3 }))
    expect(result.current[0]).toEqual({ name: 'xiaoming', age: 3 })

    act(() => {
      result.current[1]({ name: 'xiaohu' })
    })
    expect(result.current[0]).toEqual({ name: 'xiaohu', age: 3 })

    act(() => {
      result.current[1]((prevState) => ({ age: prevState.age + 1 }))
    })
    expect(result.current[0]).toEqual({ name: 'xiaohu', age: 4 })
  })
});