import { Dispatch, SetStateAction, useCallback, useRef, useState } from "react";
import useUnmount from "../useUnmount";

const useRafStage = <T>(initialValue: T): [T, Dispatch<SetStateAction<T>>] => {
  const [state, setState] = useState<T>(initialValue);
  const rafRef = useRef(0);

  const updateState = useCallback((val: SetStateAction<T>) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      setState(val)
    })
  }, [])

  useUnmount(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
  })

  return [state, updateState]
}

export default useRafStage;