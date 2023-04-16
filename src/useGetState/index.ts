import { useCallback, useRef, useState } from 'react';

const useGetState = <T>(initialValue: T) => {
  const [state, setState] = useState<T>(initialValue);
  
  const stateRef = useRef<T>(state)
  stateRef.current = state

  const getState = useCallback(() => stateRef.current, []);

  return [state, setState, getState] as const;
}

export default useGetState