import { useState } from "react";
import { isFunction } from "../utils";

type StateReducer<T> = (state: T) => Partial<T>;

type SetState<T> = (prevState: Partial<T> | StateReducer<T>) => void;

function useSetState<T extends Record<string, any>>(initialState: T | (() => T)): [T, SetState<T>] {
  const [state, setState] = useState(initialState);
  const setMergedState = (newState: Partial<T> | StateReducer<T>) => {

    setState((prevState: T) => Object.assign({}, prevState, isFunction(newState) ? newState(prevState) : newState));
  }
  return [state, setMergedState];
}

export default useSetState;