import { isPlainObject } from "lodash-es"
import { useState } from "react"
import useCreation from "../useCreation"

const proxyMap = new WeakMap()

const rawMap = new WeakMap()

const deepProxy = (target: any, cb: () => void): any => {
  if (proxyMap.has(target)) return target
  if (rawMap.has(target)) return rawMap.get(target)
  const proxy: any = new Proxy(target, {
    get(target, key, receiver) {
      const result = Reflect.get(target, key, receiver)
      return isPlainObject(result) || Array.isArray(result) ? deepProxy(result, cb) : result
    },
    set(target, key, value) {
      let res = true
      if (target[key] !== value) {
        res = Reflect.set(target, key, value)
        cb()
      }
      return res
    },
    deleteProperty(target, key) {
      const res = Reflect.deleteProperty(target, key)
      cb()
      return res
    }
  })
  rawMap.set(target, proxy)
  proxyMap.set(proxy, target)
  return proxy
}

const useReactive = (initialized: Record<string | symbol, any>) => {
  const [, setState] = useState(0)
  const proxy = useCreation(() => deepProxy(initialized, () => setState(state => state + 1)), [])

  return proxy
}

export default useReactive