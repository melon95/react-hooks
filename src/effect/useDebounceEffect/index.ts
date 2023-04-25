import { DebounceSettings } from 'lodash-es'
import { DependencyList, EffectCallback, useEffect, useState } from 'react'
import useDebounceFn from '../useDebounceFn'
import useUpdateEffect from '../useUpdateEffect'
interface UseDebounceEffectOptions extends DebounceSettings {
  wait?: number
}

const useDebounceEffect = (effect: EffectCallback, deps?: DependencyList, options: UseDebounceEffectOptions = {},) => {
  const [flag, setFlag] = useState({})

  // 多次调用run，只会更新一次flag
  const { run } = useDebounceFn(() => {
    setFlag({})
  }, options)

  useEffect(() => {
    return run()
  }, deps)

  useUpdateEffect(effect, [flag])
}

export default useDebounceEffect