import { DependencyList, EffectCallback, useEffect, useState } from "react"
import useUpdateEffect from "../../useUpdateEffect"
import useThrottleFn from "../useThrottleFn"


const useThrottleEffect = (effect: EffectCallback, deps?: DependencyList, options?: UseThrottleFnOptions) => {
  
  const [flag, setFlag] = useState({})

  const { run } = useThrottleFn(() => {
    setFlag({})
  }, options)

  useEffect(() => {
    return run()
  }, deps)

  useUpdateEffect(effect, [flag])
}

export default useThrottleEffect