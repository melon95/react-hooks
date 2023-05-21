import { Plugin } from './plugin';

export type Service<TData, TParams> = (params: TParams) => Promise<TData>

export interface Options<TData, TParams> {
  manual?: boolean
  defaultParams?: TParams
  onBefore?: (params: TParams) => void
  onSuccess?: (data: TData, params: TParams) => void,
  onError?: (e: Error, params: TParams) => void,
  onFinally?: (params: TParams, data?: TData, e?: Error) => void,

  plugins?: Plugin<TData, TParams>[]

  loadingDelay?: number // delay loading plugin
  ready?: boolean
  pollingInterval?: number // polling plugin
}

export interface Result<TData, TParams> {
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

export interface State<TData, TParams> {
  loading: boolean
  data: TData
  error: Error | undefined
  params: TParams
}