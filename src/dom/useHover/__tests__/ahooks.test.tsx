// write your test cases here
import { act, fireEvent, render, renderHook } from '@testing-library/react';
import React from 'react';
import useHover from '..';


describe('useHover', () => {
  it('should work', () => {
    let trigger: number = 0;
    const { getByText } = render(<button>Hover </button>);
    const { result } = renderHook(() =>
      useHover(getByText('Hover'), {
        onEnter: () => {
          trigger++;
        },
        onLeave: () => {
          trigger++;
        },
      }),
    );

    expect(result.current).toBe(false);

    act(() => void fireEvent.mouseEnter(getByText('Hover')));
    expect(result.current).toBe(true);
    expect(trigger).toBe(1);

    act(() => void fireEvent.mouseLeave(getByText('Hover')));
    expect(result.current).toBe(false);
    expect(trigger).toBe(2);
  });
});
