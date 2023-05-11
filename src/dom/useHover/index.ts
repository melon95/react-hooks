import { isFunction } from "lodash-es"
import { RefObject, useEffect, useState } from "react"
import useMemoizedFn from "../../useMemoizedFn"

type BasicTarget = HTMLElement | (() => HTMLElement) | RefObject<HTMLElement> | null

interface Options {
  onEnter?: () => void
  onLeave?: () => void
  onChange?: (isHovering: boolean) => void
}

const getTargetElement = (target: BasicTarget) => {
  if (!target) return;
  if (isFunction(target)) {
    return target()
  }
  if ('current' in target) { 
    return target.current
  }
  return target
}

const useHover = (target: BasicTarget, options: Options = {}) => {
  const { onEnter, onLeave, onChange } = options
  const [state, setState] = useState(false)

  const onMouseEnter = useMemoizedFn((e: MouseEvent) => {
      setState(true)
      onEnter?.()
      onChange?.(true)
  })
  
  const onMouseLea = useMemoizedFn((e: MouseEvent) => {
      setState(false)
      onLeave?.()
      onChange?.(false)
    })
  useEffect(() => {
    const el = getTargetElement(target)
    if (!el) return;
    el.addEventListener('mouseenter', onMouseEnter)
    el.addEventListener('mouseleave', onMouseLea)
    return () => {
      el.removeEventListener('mouseenter', onMouseEnter)
      el.removeEventListener('mouseleave', onMouseLea)
    }
  }, [target])

  return state
}

export default useHover