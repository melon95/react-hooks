import { useState } from 'react'
import useLatest from '../useLatest'
import useMemoizedFn from '../useMemoizedFn'

export type Props = Record<string, any>

export interface Options {
  defaultValue?: any
  defaultValuePropName?: string
  valuePropName?: string
  trigger?: string
}

const useControllableValue = <TValue>(props: Props = {}, options: Options = {}) => {
  const { defaultValue, defaultValuePropName = 'defaultValue', valuePropName = "value", trigger = "onChange" } = options

  const hasValue = props.hasOwnProperty(valuePropName)
  const hasDefaultValue = props.hasOwnProperty(defaultValuePropName)

  const [state, setState] = useState<TValue>(hasValue ? props[valuePropName] : (hasDefaultValue ? props[defaultValuePropName] : defaultValue))
  const stateRef = useLatest(hasValue ? props[valuePropName] : state)


  const updateState = useMemoizedFn((newValue: TValue, ...args: any[]) => {
    if (!hasValue) {
      setState(newValue)
    }
    props[trigger]?.(newValue, ...args)
  })


  return [stateRef.current, updateState]
}

export default useControllableValue