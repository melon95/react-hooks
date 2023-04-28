import { useCallback, useRef } from "react"

type LockFn<Prop extends Array<any>, Result> = (...args: Prop) => Promise<Result>

const useLockFn = <Prop extends Array<any>, Result>(fn: LockFn<Prop, Result>) => {
  const lockRef = useRef<boolean>(false)

  const lockFn = useCallback(async (...args: Prop) => {
    if (lockRef.current) return
    lockRef.current = true
    try {
        const res = await fn(...args)
        lockRef.current = false
        return res
    } catch(e) {
      lockRef.current = false
      throw e
    }

  }, [fn])
  return lockFn
}

export default useLockFn