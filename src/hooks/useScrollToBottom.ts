import { useEffect, useRef } from "react"

export default function useScrollToBottom(effect: unknown[]) {
  const scrollRef = useRef()

  useEffect(() => {
    const ele = scrollRef.current as HTMLElement
    if (ele) {
      ele.scrollTop = ele.scrollHeight
    }
  }, [effect])

  return scrollRef
}
