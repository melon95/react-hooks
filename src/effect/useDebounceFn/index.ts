import { DebounceSettings, DebouncedFunc, debounce } from 'lodash-es';
import { useCallback } from 'react';

interface UseDebounceEffectOptions extends DebounceSettings {
  wait?: number
}

type noop = (...args: any[]) => any;

export interface UseDebounceFnReturn<T extends noop> {
  run: DebouncedFunc<T>
  cancel: DebouncedFunc<T>['cancel']
  flush: DebouncedFunc<T>['flush']
}


const useDebounceFn = <T extends noop>(fn: T, options:UseDebounceEffectOptions = {} ): UseDebounceFnReturn<T> => {
    const { wait = 1000,leading = false, trailing = true, maxWait } = options

    const debouncedFn = useCallback(debounce(fn, wait, {
      leading,
      trailing,
      maxWait,
    }), [fn])

  return {
    run: debouncedFn,
    cancel: debouncedFn.cancel,
    flush: debouncedFn.flush,
  }
}

export default useDebounceFn