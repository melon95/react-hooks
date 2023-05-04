import { useCallback, useEffect } from "react"
import useLatest from "../../useLatest"

type Target = Element
type EventName = keyof DocumentEventMap

const useClickAway = (onClickAway: (e: Event) => void, target: Target | Target[], eventName: EventName | EventName[] = ['click']) => {
  const handlerRef = useLatest(onClickAway)
  const targetRef = useLatest(target)
  const handler = useCallback((e: Event) => {
      const target = Array.isArray(targetRef.current) ? targetRef.current : [targetRef.current]
			const isAway = !target.some((el) => el.contains(e.target as Node));
      console.log('isAway', isAway)
			if (isAway) {
				handlerRef.current(e);
			}
		}, [])
  useEffect(() => {
    const events = Array.isArray(eventName) ? eventName : [eventName]
    events.forEach((name) => {
      document.addEventListener(name, handler)
    })
    return () => {
      events.forEach((name) => {
        document.removeEventListener(name, handler)
      })
    }
  }, [])
}

export default useClickAway