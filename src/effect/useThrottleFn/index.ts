import { DebouncedFunc, throttle, ThrottleSettings } from "lodash-es"
import { useCallback } from "react"

export type  noop = (...args: any[]) => any
export interface useThrottleFnOptions extends ThrottleSettings {
  wait?: number
}

export interface useThrottleFnReturn<T extends noop> {
  run: DebouncedFunc<T>
  cancel: DebouncedFunc<T>['cancel']
  flush: DebouncedFunc<T>['flush']
}

const useThrottleFn = <T extends noop>(fn: T, options: useThrottleFnOptions = {}): useThrottleFnReturn<T> => {
  const { wait = 1000, leading = true, trailing = true } = options
  const throttledFn = useCallback(throttle(fn, wait, { leading, trailing }), [])
  return {
    run: throttledFn,
    cancel: throttledFn.cancel,
    flush: throttledFn.flush,
  }
}

export default useThrottleFn