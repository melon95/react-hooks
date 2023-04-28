import { useCallback, useState } from 'react'

const useUpdate = () => {
  const [, setState] = useState(0)
  return useCallback(() => setState((prev) => prev + 1), [])
}

export default useUpdate