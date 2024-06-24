import { debounce } from "lodash-es"
import { useEffect, useMemo, useState } from "react"
import type { DraggableEventHandler } from "react-draggable"

import useStore, { type StorageKey } from "./useStore"

export default function useStorageValue<T = any>(
  key: StorageKey,
  initialState?: T
) {
  const [state, setState] = useStore(key)
  const [innerState, setInnerState] = useState<T>(initialState ?? state)

  useEffect(() => {
    if (initialState) {
      setState(initialState)
    }
  }, [])

  useEffect(() => {
    setInnerState(state)
  }, [state])

  const debounceSet = useMemo(() => {
    return debounce(setState, 100)
  }, [])

  const onChange = (value: T) => {
    debounceSet(value)
    setInnerState(value)
  }
  return {
    state: innerState,
    onChange
  }
}
