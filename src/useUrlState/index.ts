import queryString from 'query-string'
import { useCallback, useEffect } from "react"
import useSetState from '../useSetState'

interface Options {
  navigateMode?: 'push' | 'replace'
  parseOptions?: any,
  stringifyOptions?: any
}

const HistoryNavigateMode = {
  push: 'pushState',
  replace: 'replaceState'
} as const

const useLocation = () => window.location
const useHistory = () => window.history

const useUrlState = <T extends Record<string, any>>(initialValue?: T, options?: Options): [T, (query: T) => void] => {
  const { hash, search, origin, pathname } = useLocation()
  const history = useHistory()
  const { navigateMode = 'push', parseOptions, stringifyOptions } = options || {}
  const [query, setQuery] = useSetState<T>(initialValue || queryString.parse(search, parseOptions) as T)

  const updateQueryString = useCallback((query: T) => {
    const search = queryString.stringify(query, stringifyOptions)
    const url = new URL(`${origin}${pathname}${search ? `?${search}` : ''}${hash}`)
    
    history[HistoryNavigateMode[navigateMode]]({}, "", url.toString())
  }, [origin, pathname, hash, navigateMode, history])

  useEffect(() => {
    updateQueryString(query)
  }, [query, updateQueryString])
  
  return [query, setQuery]
}

export default useUrlState