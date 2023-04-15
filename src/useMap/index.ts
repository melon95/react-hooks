import { useMemo, useState } from 'react'

type InitialValue<K, V> = Iterable<[K, V]>

interface Actions<K, V> {
  set: (key: K, value: V) => void
  remove: (key: K) => void
  reset: () => void
  setAll: (newMap?: InitialValue<K, V>) => void
  get: (key: K) => V | undefined
}

const useMap = <K, V>(initialValue?: InitialValue<K, V>): [Map<K, V>, Actions<K, V>] => {
  const [map, setMap] = useState(new Map<K, V>(initialValue))
  
  const actions: Actions<K, V> = useMemo(() => {
    const set = (key: K, value: V) => setMap((preMap) => new Map(preMap.set(key, value)))

    const remove = (key: K) =>   setMap((preMap) => {
      const newMap = new Map(preMap)
      newMap.delete(key)
      return newMap
    })

    const reset = () => setMap(new Map(initialValue))

    const setAll = (newMap?: InitialValue<K, V>) => setMap(new Map(newMap))

    const get = (key: K) => map.get(key)
    
    return { set, remove, reset, get, setAll }
  }, [map])

  return [map, actions]
}

export default useMap