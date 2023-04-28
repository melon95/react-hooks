import { isNumber } from "lodash-es"
import { useCallback, useEffect, useRef } from "react"

type RafIntervalCallback = () => void

type Delay = number

interface Options {
  immediate?: boolean
}

interface Handler {
  id: number | NodeJS.Timer
}

const RequestAnimationFrameIsDefined = () => typeof requestAnimationFrame === 'function'

const createRafInterval = (callback: RafIntervalCallback, delay: Delay): Handler => {
  const handler: Handler = {
    id: 0
  }
  if (RequestAnimationFrameIsDefined()) {
    let start = Date.now()
    const loop = () => {
        const now = Date.now()
      if (now - start >= delay) {
        start = now
        callback()
      }
      handler.id = requestAnimationFrame(loop)
    }
    handler.id = requestAnimationFrame(loop)
  } else {
    handler.id = setInterval(callback, delay)
  }
  return handler
}

const useRafInterval = (effect: RafIntervalCallback, delay: Delay, options: Options = {}) => {
  const timeRef = useRef<number>(Date.now())
  const callbackRef = useRef(effect)
  const rafReturnRef = useRef<Handler>()

  const clear = useCallback(() => {
    if (rafReturnRef.current?.id) {
      if (RequestAnimationFrameIsDefined()) {
        cancelAnimationFrame(rafReturnRef.current.id as number)
      } else {
        clearTimeout(rafReturnRef.current.id)
      }
    }
  }, [])

  useEffect(() => {
    if (!isNumber(delay) || delay < 0) return
    if (options.immediate) {
      callbackRef.current()
    }
    rafReturnRef.current = createRafInterval(() => {
      callbackRef.current()
    }, delay)
    return clear
  }, [delay])

  return clear
}

export default useRafInterval