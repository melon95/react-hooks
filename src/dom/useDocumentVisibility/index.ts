import { useCallback, useState } from "react"
import isBrowser from "../../utils/isBrowser"
import useEventListener from "../useEventListener"

const getVisibilityState = (): DocumentVisibilityState => {
  return isBrowser ? document.visibilityState : 'visible'
}

const useDocumentVisibility = (): DocumentVisibilityState => {
  const [visibilityState, setVisibilityState] = useState<DocumentVisibilityState>(getVisibilityState())
  const handleVisibilityChange = useCallback(() => {
    setVisibilityState(getVisibilityState())
  }, [])

  useEventListener('visibilitychange', handleVisibilityChange, { target: document })
  return visibilityState
} 

export default useDocumentVisibility