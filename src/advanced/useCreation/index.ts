import { DependencyList, useCallback, useRef, useState } from "react"
import useUpdateEffect from "../../effect/useUpdateEffect"

const depsAreSame = (oldDeps: DependencyList, deps: DependencyList) => {
  if (oldDeps === deps) return true
  for (let i = 0; i < oldDeps.length; i++) {
    if (!Object.is(oldDeps[i],deps[i])) return false
  }
  return true
}

type Factory<T> = () => T

const useCreation = <T>(factory: Factory<T>, deps: DependencyList): T => {
  const factoryCallback = useCallback(() => {
    return factory()
  }, deps)

  const [state, setState] = useState(factoryCallback())

  useUpdateEffect(() => {
    setState(factoryCallback())
  }, [factoryCallback])

  return state
}

export const useCreationHooks = <T>(factory: Factory<T>, deps: DependencyList): T => {
  const { current } = useRef({
    result: undefined,
    deps,
    initialized: false,
  })
  if (!current.initialized || !depsAreSame(current.deps, deps)) {
    current.deps = deps
    current.result = factory()
    current.initialized = true
  }
  return current.result
}

export default useCreation
