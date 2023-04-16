import { useCallback, useState } from "react"

const useResetState = <T>(initialValue: T) => {
  const [value, setValue] = useState<T>(initialValue)

  const reset = useCallback(() => {
    setValue(initialValue)
  }, [initialValue])

  return [value, setValue, reset] as const
}

export default useResetState