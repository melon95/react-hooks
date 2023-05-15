import useMount from "../../lifeCycle/useMount"
import useUnmount from "../../lifeCycle/useUnmount"
import useCreation from "../useCreation"

function createEventEmitter<T>() {
  const listeners: Record<string, any> = {}
  const eventName = 'change'
  const on = (event: string, callback: Function) => {
    if (!listeners[event]) {
      listeners[event] = []
    }
    listeners[event].push(callback)
  }
  const off = (event: string, callback: Function) => {
    if (!listeners[event]) {
      return
    }
    const index = listeners[event].indexOf(callback)
    listeners[event].splice(index, 1)
  }
  const once = (event: string, callback: Function) => {
    const invoke = (...args: any[]) => {
      callback(...args)
      off(event, invoke)
    }
    on(event, invoke)
  }
  const clear = (event: string) => {
    if (!listeners[event]) {
      return
    }
    listeners[event] = []
  }
  const emit = (event: string, ...args: T[]) => {
    listeners[event] && listeners[event].forEach((callback: Function) => {
      callback(...args)
    })
  }
  const useSubscription = (callback: Function) => {
    useMount(() => {
      on(eventName, callback)
    })
    useUnmount(() => {
      off(eventName, callback)
    })
  }
  return {
    useSubscription,
    emit: (...args: T[]) => emit(eventName, ...args),
  }
}

const useEventEmitter = <T>() => {
  const eventEmitter = useCreation(() => createEventEmitter<T>(), [])
  
  return eventEmitter
}

export default useEventEmitter