import { useEffect, useRef } from 'react'
import {isDev, isFunction} from '../utils'

const useUnmount = (callback: () => void) => {
  if (isDev) { 
    if (!isFunction(callback)) {
      throw new Error(`useUnmount callback expected to be a function, but get ${typeof callback}`)
    }
  }
  const callbackRef = useRef(callback)
  callbackRef.current = callback
  useEffect(() => {
    return () => {
      callbackRef.current?.()
    }
  }, [])
}

export default useUnmount