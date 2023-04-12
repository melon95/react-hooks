import { act, renderHook } from "@testing-library/react"
import useLocalStorageState from ".."

describe('useLocalStorageState', () => {
  test('initial value', () => {
    const storageKey = 'test'
    const { result } = renderHook(() => useLocalStorageState(storageKey, { defaultValue: "default value" }))
    
    expect(result.current[0]).toBe("default value")
    act(() => {
      result.current[1]("new value")
    })
    expect(result.current[0]).toBe("new value")
    expect(localStorage.getItem(storageKey)).toBe("\"new value\"")
  })

  test('get storage value', () => {
    const storageKey = 'test'
    const { result } = renderHook(() => useLocalStorageState(storageKey))
    
    expect(result.current[0]).toBe("new value")
    act(() => {
      result.current[1]("new value2")
    })
    expect(result.current[0]).toBe("new value2")
    expect(localStorage.getItem(storageKey)).toBe("\"new value2\"")
  })

  test('remove storage value', () => {
    const storageKey = 'test'
    const { result } = renderHook(() => useLocalStorageState(storageKey))
    
    expect(result.current[0]).toBe("new value2")
    act(() => {
      result.current[1]()
    })
    expect(result.current[0]).toBe(undefined)
    expect(localStorage.getItem(storageKey)).toBe(null)
  })

  test('save array', () => {
    const storageKey = 'testArray'
    const { result } = renderHook(() => useLocalStorageState<Array<number>>(storageKey, { defaultValue: [] }))

    expect(result.current[0]).toEqual([])

    act(() => {
      result.current[1]([1, 2, 3])
    })
    expect(result.current[0]).toEqual([1, 2, 3])
    expect(localStorage.getItem(storageKey)).toBe("[1,2,3]")
  })
})