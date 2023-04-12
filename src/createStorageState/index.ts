import { SetStateAction, useCallback, useState } from 'react'
import { isFunction } from '../utils'

interface Options<T> {
  defaultValue?: T | (() => T)
  serialize?: (value: T) => string
  deserialize?: (value: string) => T
}


const createStorageState = (storage: Storage) => {
  return <T>(key: string, options: Options<T> = {}): [T, (newValue?: SetStateAction<T>) => void] => {
    const { defaultValue, serialize = JSON.stringify, deserialize = JSON.parse } = options
  
    const [state, setState] = useState<T>(() => {
      const valueInLocalStorage = storage.getItem(key)
      if (valueInLocalStorage !== null) {
        return deserialize(valueInLocalStorage)
      }
      return isFunction(defaultValue) ? defaultValue() : defaultValue
    })
  
    const updateState = useCallback((value?: SetStateAction<T>) => {
      const result = isFunction(value) ? value(state) : value
      setState(result!)
      if (result === undefined) {
        storage.removeItem(key)
      } else {
        storage.setItem(key, serialize(result))
      }
    }, [key, serialize, state])
      
    return [state, updateState]
  }
}

export default createStorageState