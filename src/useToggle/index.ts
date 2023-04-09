import { useMemo, useState } from "react"

interface StateAction<T> {
  setLeft: () => void
  setRight: () => void
  toggle: () => void
  set: (value: T) => void
}

function useToggle<L, R>(leftValue: L, rightValue: R): [L | R, StateAction<L | R>] {
  const [state, setState] = useState<L | R>(leftValue)
  const action = useMemo(() => {
    const setLeft = () => setState(leftValue)
    const setRight = () => setState(rightValue)
    const toggle = () => setState((prev) => (prev === leftValue ? rightValue : leftValue))
    return {
      setLeft,
      setRight,
      toggle,
      set: (value: L | R) => setState(value)
    }
  }, [])
  return [state, action]
}

export default useToggle