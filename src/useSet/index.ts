import { useMemo, useState } from "react"

interface Actions<T> {
  add: (value: T) => void
  remove: (value: T) => void
  reset: () => void
}

const useSet = <T>(initialValue?: Iterable<T>): [Set<T>, Actions<T>] => {
  const [set, setSet] = useState(new Set(initialValue))
  const actions: Actions<T> = useMemo(() => {
    const add = (value: T) => {
      setSet((preSet) => {
        if (preSet.has(value)) return preSet
        return new Set(preSet.add(value))
      })
    }

    const remove = (value: T) => setSet((preSet) => {
      if (!preSet.has(value)) return preSet
      const newSet = new Set(preSet)
      newSet.delete(value)
      return newSet
    })

    const reset = () => setSet(new Set(initialValue))
    
    return { add, remove, reset }
  }, [])

  return [set, actions]
}

export default useSet