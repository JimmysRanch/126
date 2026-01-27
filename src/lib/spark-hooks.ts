import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react'

const storagePrefix = 'kv:'

const getStorageKey = (key: string) => `${storagePrefix}${key}`

const readStoredValue = <T,>(key: string, initialValue: T): T => {
  if (typeof window === 'undefined') {
    return initialValue
  }

  const storageKey = getStorageKey(key)
  const storedValue = window.localStorage.getItem(storageKey)

  if (!storedValue) {
    return initialValue
  }

  try {
    return JSON.parse(storedValue) as T
  } catch {
    return initialValue
  }
}

const writeStoredValue = (key: string, value: unknown) => {
  if (typeof window === 'undefined') {
    return
  }

  const storageKey = getStorageKey(key)

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(value))
  } catch {
    // Ignore write failures (e.g. storage quota) during testing.
  }
}

export const useKV = <T,>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] => {
  const [value, setValueState] = useState<T>(() => readStoredValue(key, initialValue))
  const storageKey = useMemo(() => getStorageKey(key), [key])

  useEffect(() => {
    setValueState(readStoredValue(key, initialValue))
  }, [initialValue, key])

  useEffect(() => {
    writeStoredValue(key, value)
  }, [key, value])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== storageKey) {
        return
      }

      if (!event.newValue) {
        setValueState(initialValue)
        return
      }

      try {
        setValueState(JSON.parse(event.newValue) as T)
      } catch {
        setValueState(initialValue)
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [initialValue, storageKey])

  const setValue = useCallback<Dispatch<SetStateAction<T>>>((nextValue) => {
    setValueState((previous) =>
      typeof nextValue === 'function' ? (nextValue as (prev: T) => T)(previous) : nextValue
    )
  }, [])

  return [value, setValue]
}
