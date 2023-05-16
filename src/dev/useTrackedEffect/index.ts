import { DependencyList, useEffect, useRef } from "react"
import useLatest from "../../advanced/useLatest"

type TrackedEffect = (changes: number[], prevDeps: DependencyList, nextDeps: DependencyList) => void | (() => void | undefined)

const useTrackedEffect = (effect: TrackedEffect, deps: DependencyList) => {
  const effectFn = useLatest(effect)
  const prevDepsRef = useRef<DependencyList>()
  useEffect(() => {
    const prevDeps = prevDepsRef.current
    prevDepsRef.current = deps
    const changes: number[] = []
    if (deps) {
      for (let i = 0; i < deps.length; i++) {
        if (!Object.is(prevDeps?.[i], deps[i])) {
          changes.push(i)
        }
      }
    }
    return effectFn.current(changes, prevDeps, deps)
  }, deps)
}

export default useTrackedEffect