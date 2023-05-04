import { useCallback, useEffect, useRef } from "react"

interface Options {
  target?: HTMLElement | Window
  capture?: boolean
  once?: boolean
  passive?: boolean
}


const useEventListener = (eventName: string, handler: (e: Event) => void, options: Options = {}) => {
  const { target = window, capture = false, once = false, passive = false } = options
  const handlerRef = useRef(handler)

  const eventHandler = useCallback((e: Event) => {
    handlerRef.current(e)
  }, [])
  useEffect(() => {
    target.addEventListener(eventName, eventHandler, { capture, once, passive })
    return () => {
      target.removeEventListener(eventName, eventHandler, { capture })
    }
  })
}


export default useEventListener