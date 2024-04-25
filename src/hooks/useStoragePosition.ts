import { debounce } from "lodash-es"
import { useEffect, useMemo, useState } from "react"
import type { DraggableEventHandler } from "react-draggable"

import useStore, { POSITION } from "./useStore"

export default function useStoragePosition() {
  const [position, setPosition] = useStore(POSITION)
  const [innerPosition, setInnerPosition] = useState(position)

  useEffect(() => {
    setInnerPosition(position)
  }, [position])

  const debounceSet = useMemo(() => {
    return debounce(setPosition, 100)
  }, [])

  const onDrag: DraggableEventHandler = (e, { x, y }) => {
    debounceSet({ x, y })
    setInnerPosition({ x, y })
  }
  return {
    position: innerPosition,
    onDrag
  }
}
