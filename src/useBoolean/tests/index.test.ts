import { renderHook, act } from '@testing-library/react';
import useBoolean from '../';
describe('useBoolean', () => {
  test('test useBoolean', () => {
    const { result } = renderHook(() => useBoolean());
    expect(result.current[0]).toBe(false);

    act(() => {
      result.current[1].setTrue();
    })
    expect(result.current[0]).toBe(true);

    act(() => {
      result.current[1].setFalse();
    })
    expect(result.current[0]).toBe(false);

    act(() => {
      result.current[1].toggle();
    })
    expect(result.current[0]).toBe(true);

    act(() => {
      result.current[1].toggle();
    })
    expect(result.current[0]).toBe(false);

    act(() => {
      result.current[1].set(true);
    })
    expect(result.current[0]).toBe(true);

    act(() => {
      result.current[1].set(false);
    })
    expect(result.current[0]).toBe(false);
  });
});