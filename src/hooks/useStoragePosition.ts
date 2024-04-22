import { debounce } from "lodash-es"
import { useEffect, useMemo, useState } from "react"
import type { DraggableEventHandler } from "react-draggable"

import { useStorage } from "@plasmohq/storage/hook"

export default function useStoragePosition() {
  const [position, setPosition] = useStorage("position")
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
