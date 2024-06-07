import { useMemo } from "react"

import type { TargetNode } from "~/selector-recorder"

import useStorageValue from "./useStorageValue"
import { TEMPLATE } from "./useStore"

export default function useTemplate() {
  const { state: template } = useStorageValue<string>(
    TEMPLATE,
    "page.element({ text:$text, css:$selector }).index($idx).click();"
  )

  const info = useMemo(() => {
    return {
      hasSelector: template?.includes("$selector"),
      hasText: template?.includes("$text"),
      hasIdx: template?.includes("$idx")
    }
  }, [template])

  function handleCode(item: TargetNode) {
    return template
      .replace("$text", item.content ? `'${item.content}'` : `undefined`)
      .replace("$selector", `'${item.selector}'`)
      .replace("$idx", `${item.idx}`)
  }
  return {
    info,
    template,
    handleCode
  }
}
