import { useState } from 'react'
import useCreation from '../advanced/useCreation'
import useMemoizedFn from '../advanced/useMemoizedFn'
import useMount from '../lifeCycle/useMount'
import useUnmount from '../lifeCycle/useUnmount'
import FetchRequest from './src/fetch'
import delayLoadingPlugin from './src/plugins/delayLoadingPlugin'
import { Options, Result, Service } from './src/types'

const useRequest = <TData, TParams>(service: Service<TData, TParams>, options: Options<TData, TParams> = {}): Result<TData, TParams> => {
  const { manual = false, defaultParams, ...restOptions } = options
  const [, setCount] = useState<number>(0)

  const fetchRequestIns = useCreation(() => {
    return new FetchRequest<TData, TParams>(service, {
      ...restOptions,
      plugins: [
        ...(restOptions.plugins || []),
        delayLoadingPlugin,
      ]
    }, () => setCount((c: number) => c + 1), {})
  }, [])

  useMount(() => {
    if (!manual) {
      fetchRequestIns.run(options.defaultParams)
    }
  })

  useUnmount(() => {
    fetchRequestIns.cancel()
  })

  return {
    loading: fetchRequestIns.state.loading,
    data: fetchRequestIns.state.data,
    error: fetchRequestIns.state.error,
    params: fetchRequestIns.state.params,
    run: useMemoizedFn(fetchRequestIns.run.bind(fetchRequestIns)),
    runAsync: useMemoizedFn(fetchRequestIns.runAsync.bind(fetchRequestIns)),
    refresh: useMemoizedFn(fetchRequestIns.refresh.bind(fetchRequestIns)),
    refreshAsync: useMemoizedFn(fetchRequestIns.refreshAsync.bind(fetchRequestIns)),
    mutate: useMemoizedFn(fetchRequestIns.mutate.bind(fetchRequestIns)),
    cancel: useMemoizedFn(fetchRequestIns.cancel.bind(fetchRequestIns)),
  }
}

export default useRequest