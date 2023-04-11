import { act, renderHook } from "@testing-library/react";
import Cookies from "js-cookie";
import useCookieState from "../";

describe("useCookieState", () => {
  test('no default value', () => {
    const { result, rerender } = renderHook(() => useCookieState('A'));

    expect(result.current[0]).toBe(undefined);
    expect(Cookies.get('A')).toBe(undefined);

    act(() => {
      result.current[1]('A');
    })

    expect(result.current[0]).toBe('A');
    expect(Cookies.get('A')).toBe('A');

    rerender();
    expect(result.current[0]).toBe('A')
  })

  test('default value', () => {
    const CookieName = 'B'
    const { result, rerender } = renderHook(() => useCookieState(CookieName, {
      defaultValue: () => "Default B"
    }));

    expect(result.current[0]).toBe("Default B");
    expect(Cookies.get(CookieName)).toBe(undefined);


    act(() => {
      result.current[1]('B');
    })
    expect(result.current[0]).toBe('B');
    expect(Cookies.get(CookieName)).toBe('B');


    rerender();
    expect(result.current[0]).toBe('B')
  })

  test("remove cookie", () => {
    const CookieName = 'C'
    const { result, rerender } = renderHook(() => useCookieState(CookieName))

    act(() => {
      result.current[1]('C');
    })
    expect(result.current[0]).toBe('C');
    expect(Cookies.get(CookieName)).toBe('C');

    act(() => {
      result.current[1](undefined);
    })
    expect(result.current[0]).toBe(undefined);
    expect(Cookies.get(CookieName)).toBe(undefined);

  });

  test("use same cookie name", () => {
    const CookieName = 'D'
    const hook1 = renderHook(() => useCookieState(CookieName, {
      defaultValue: 'Default D'
    }));
    const hook2 = renderHook(() => useCookieState(CookieName));

    expect(hook1.result.current[0]).toBe('Default D');
    expect(hook2.result.current[0]).toBe(undefined);
    expect(Cookies.get(CookieName)).toBe(undefined);

    act(() => {
      hook2.result.current[1]('D')
    })
    expect(hook1.result.current[0]).toBe('Default D');
    expect(hook2.result.current[0]).toBe('D');
    expect(Cookies.get(CookieName)).toBe('D');

    act(() => {
      hook1.result.current[1]('D1')
    })
    expect(hook1.result.current[0]).toBe('D1');
    expect(hook2.result.current[0]).toBe('D');
    expect(Cookies.get(CookieName)).toBe('D1');

  })
});