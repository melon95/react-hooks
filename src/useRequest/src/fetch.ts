import { isFunction } from 'lodash-es'
import { Options, PluginReturn, Service, State } from './types'


class FetchRequest<TData, TParams> {
  service: Service<TData, TParams>
  options: Options<TData, TParams>
  state: State<TData, TParams> = {
    loading: false,
    data: undefined,
    error: undefined,
    params: undefined,
  }

  plugins: PluginReturn<TData, TParams>[] = []
  update: () => void
  constructor(service: Service<TData, TParams>, options: Options<TData, TParams>, update: () => void, initialState: Partial<State<TData, TParams>> = {}) {
    this.service = service
    this.options = options
    this.update = update
    this.state = {
      ...this.state,
      ...initialState,
    }
    this.plugins = options.plugins.map(plugin => plugin(this, this.options))
  }

  setState(obj: Partial<State<TData, TParams>>) {
    this.state = {
      ...this.state,
      ...obj,
    }
    this.update()
  }


  runPluginsHandler(eventName: string, ...rest: any[]) {
    const res = this.plugins.map((plugin: any) => {
      if (isFunction(plugin[eventName])) {
        return plugin[eventName](...rest)
      }
    }).filter(Boolean)
    return Object.assign({}, ...res)
  }



  async runAsync(params: TParams) {
    if (isFunction(this.options.onBefore)) {
      this.options.onBefore(params)
    }
    const state = this.runPluginsHandler('onBefore', params)
    try {
      this.setState({
        loading: true,
        params,
        ...state
      })
      const res = await this.service(params)
      this.setState({
        data: res,
        error: undefined,
        loading: false,
      })
      if (isFunction(this.options.onSuccess)) {
        this.options.onSuccess(res, params)
      }
      this.runPluginsHandler('onSuccess')

      if (isFunction(this.options.onFinally)) {
        this.options.onFinally(params, res, undefined)
      }
      this.runPluginsHandler('onFinally')

      return res
    } catch (err: any) {
      this.setState({
        error: err,
        loading: false,
      })
      if (isFunction(this.options.onError)) {
        this.options.onError(err, params)
      }
      this.runPluginsHandler('onError')
      if (isFunction(this.options.onFinally)) {
        this.options.onFinally(params, undefined, err)
      }
      this.runPluginsHandler('onFinally')
      throw err
    }
  }

  run(params: TParams) {
    return this.runAsync(params).catch((e: Error) => {
      this.setState({
        error: e,
      })
    })
  }

  cancel() {
    this.setState({
      loading: false,
    })
    this.runPluginsHandler('onCancel')
  }

  refresh() {
    this.run(this.state.params)
  }

  async refreshAsync() {
    return this.runAsync(this.state.params)
  }

  mutate(data: TData | ((oldData: TData) => TData)) {
    this.setState({
      data: isFunction(data) ? data(this.state.data as TData) : data,
    })
  }

}

export default FetchRequest