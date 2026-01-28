import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useKV } from '../lib/spark-hooks'

describe('useKV Hook', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
  })

  it('should not cause infinite loops with inline array literals', () => {
    let renderCount = 0
    
    const { result } = renderHook(() => {
      renderCount++
      // This is the problematic pattern - inline array literal
      return useKV<string[]>('test-key', [])
    })

    // Should only render once initially
    expect(renderCount).toBe(1)
    expect(result.current[0]).toEqual([])
  })

  it('should not cause infinite loops with inline object literals', () => {
    let renderCount = 0
    
    const { result } = renderHook(() => {
      renderCount++
      // This is the problematic pattern - inline object literal
      return useKV<{ items: string[] }>('test-obj-key', { items: [] })
    })

    // Should only render once initially
    expect(renderCount).toBe(1)
    expect(result.current[0]).toEqual({ items: [] })
  })

  it('should update value when setter is called', () => {
    const { result } = renderHook(() => useKV<string[]>('test-update', []))

    act(() => {
      result.current[1](['item1', 'item2'])
    })

    expect(result.current[0]).toEqual(['item1', 'item2'])
  })

  it('should persist value to localStorage', () => {
    const { result } = renderHook(() => useKV<string[]>('test-persist', []))

    act(() => {
      result.current[1](['persisted'])
    })

    const stored = localStorage.getItem('kv:test-persist')
    expect(stored).toBe('["persisted"]')
  })

  it('should read initial value from localStorage if available', () => {
    localStorage.setItem('kv:test-initial', '["from-storage"]')

    const { result } = renderHook(() => useKV<string[]>('test-initial', []))

    expect(result.current[0]).toEqual(['from-storage'])
  })

  it('should update state when key changes', () => {
    localStorage.setItem('kv:key1', '["value1"]')
    localStorage.setItem('kv:key2', '["value2"]')

    const { result, rerender } = renderHook(
      ({ key }) => useKV<string[]>(key, []),
      { initialProps: { key: 'key1' } }
    )

    expect(result.current[0]).toEqual(['value1'])

    rerender({ key: 'key2' })

    expect(result.current[0]).toEqual(['value2'])
  })

  it('should use initialValue when localStorage is empty', () => {
    const { result } = renderHook(() => useKV<string[]>('empty-key', ['default']))

    expect(result.current[0]).toEqual(['default'])
  })

  it('should handle setter function form', () => {
    const { result } = renderHook(() => useKV<number>('counter', 0))

    act(() => {
      result.current[1]((prev) => prev + 1)
    })

    expect(result.current[0]).toBe(1)

    act(() => {
      result.current[1]((prev) => prev + 5)
    })

    expect(result.current[0]).toBe(6)
  })

  it('should not trigger infinite re-renders when initialValue ref changes', () => {
    let renderCount = 0
    
    const { rerender } = renderHook(
      ({ initial }) => {
        renderCount++
        return useKV<string[]>('render-test', initial)
      },
      { initialProps: { initial: [] as string[] } }
    )

    const initialRenderCount = renderCount

    // Force a rerender with a new array reference but same content
    rerender({ initial: [] })

    // Should only trigger one additional render for the rerender itself,
    // not an infinite loop
    expect(renderCount).toBeLessThan(initialRenderCount + 5)
  })
})
