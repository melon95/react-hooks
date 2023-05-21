import FetchRequest from "../fetch"
import { Options } from "../types"

const delayLoadingPlugin = <TData, TParams>(ins: FetchRequest<TData, TParams>, options: Options<TData, TParams>): any => {
  const { loadingDelay = 0, ready } = options
  if (loadingDelay <= 0) return {}
  let timeoutId: NodeJS.Timeout


  return {
    onBefore() {
      clearTimeout(timeoutId)
      if (ready !== false) {
        timeoutId = setTimeout(() => {
          ins.setState({
            loading: true
          })
        }, loadingDelay)
      }
      return {
        loading: false
      }
    },
    onFinally() {
      clearTimeout(timeoutId)
    },
    onCancel() {
      clearTimeout(timeoutId)
    }
  }
}

export default delayLoadingPlugin