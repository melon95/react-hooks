import createStorageState from '../createStorageState'

const useSessionStorageState = createStorageState(sessionStorage)

export default useSessionStorageState