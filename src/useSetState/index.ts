import { useState } from "react";
import { isFunction } from "../utils";

type StateReducer<T> = (state: T) => Partial<T>;

type SetStateAction<T> = (prevState: Partial<T> | StateReducer<T>) => void;

function useSetState<T>(initialState: T | (() => T)): [T, SetStateAction<T>] {
  const [state, setState] = useState(initialState);
  const setMergedState = (newState: Partial<T> | StateReducer<T>) => {

    setState((prevState: T) => Object.assign({}, prevState, isFunction(newState) ? newState(prevState) : newState));
  }
  return [state, setMergedState];
}

export default useSetState;