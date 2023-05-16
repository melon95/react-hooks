import { useEffect, useRef } from "react"

type Data = Record<string, any>

const useWhyDidYouUpdate = (name: string, data: Data = {}) => {

  const preData = useRef<Data>()
  useEffect(() => {
    if (preData.current) {
      const prevProps = preData.current
      const changes: Data = {}
      let hasChanges = false
      Object.keys({ ...preData.current ,...data, }).forEach((key: string) => {
        if (!Object.is(prevProps[key], data[key])) {
          hasChanges = true
          changes[key] = {
            from: prevProps[key],
            to: data[key]
          }
        }
      })
      hasChanges && console.log('[why-did-you-update]', name, changes)
    }
    preData.current = data
  })
}

export default useWhyDidYouUpdate