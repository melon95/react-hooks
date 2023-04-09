import { SetStateAction, useMemo, useState } from "react";

interface BooleanActions {
  setTrue: () => void;
  setFalse: () => void;
  toggle: () => void;
  set: (value: SetStateAction<boolean>) => void;
}

type BooleanReturn = [boolean, BooleanActions]

const useBoolean = (initialValue: boolean = false): BooleanReturn => {
  const [value, setValue] = useState<boolean>(initialValue);
  const actions = useMemo(() => {
    const setFalse = () => setValue(false);
    const setTrue = () => setValue(true);
    const toggle = () => setValue((val) => !val)
    return {
      setTrue,
      setFalse,
      toggle,
      set: setValue
    }
  }, [])
  return [value, actions]
}

export default useBoolean