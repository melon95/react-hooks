import { useState } from 'react'
import useMemoizedFn from '../advanced/useMemoizedFn'
import useMount from '../lifeCycle/useMount'

type Service<TData, TParams> = (params: TParams) => Promise<TData>

interface Options<TData, TParams> {
  manual?: boolean
  defaultParams?: TParams
  onBefore?: (params: TParams) => void
  onSuccess?: (data: TData, params: TParams) => void,
  onError?: (e: Error, params: TParams) => void,
  onFinally?: (params: TParams, data?: TData, e?: Error) => void,
}

interface Result<TData, TParams> {
  data: TData | undefined
  error: Error | undefined
  loading: boolean
  params: TParams | []
  run: (params: TParams) => void
  runAsync: (params: TParams) => Promise<TData>
  refresh: () => void
  refreshAsync: () => Promise<TData>
  mutate: (data: TData | ((oldData: TData) => TData)) => void
  cancel: () => void
}

const useRequest = <TData, TParams>(service: Service<TData, TParams>, options: Options<TData, TParams> = {}): Result<TData, TParams> => {
  const { manual = false, defaultParams, onBefore, onSuccess, onError, onFinally } = options
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<TData>()
  const [error, setError] = useState<Error>()
  const [params, setParams] = useState<TParams>(options.defaultParams)

  const invokeService = useMemoizedFn(async (params: TParams): Promise<TData> => {
    return new Promise((resolve, reject) => {
      onBefore?.(params)
      setParams(params)
      setLoading(true)
      service(params).then((data) => {
        setData(data)
        setLoading(false)
        onSuccess?.(data, params)
        resolve(data)
      }).catch((e) => {
        setError(e)
        setLoading(false)
        onError?.(e, params)
        reject(e)
      }).finally(() => {
        onFinally?.(params, data, error)
      })
    })
  })

  const run = useMemoizedFn((params: TParams) => {
    invokeService(params).catch((e: Error) => {
      setError(e)
    })
  })

  const runAsync = useMemoizedFn(async (params: TParams) => {
    return invokeService(params)
  })

  const refresh = useMemoizedFn(() => {
    run(params)
  })

  const refreshAsync = useMemoizedFn(async () => {
    return runAsync(params)
  })

  const cancel = useMemoizedFn(() => {
    setLoading(false)
  })

  const mutate = useMemoizedFn((data: TData | ((oldData: TData) => TData)) => {
    setData(data)
  })

  useMount(() => {
    if (!manual) {
      run(defaultParams)
    }
  })



  return {
    data,
    error,
    loading,
    params,
    run,
    runAsync,
    refresh,
    refreshAsync,
    mutate,
    cancel
  }
}

export default useRequest