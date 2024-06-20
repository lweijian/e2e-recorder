import { useEffect, useMemo } from "react"

import type { TargetNode } from "~/selector-recorder"

import useStorageValue from "./useStorageValue"
import { TEMPLATE } from "./useStore"

export default function useTemplate() {
  // todo: 修改initialValue的逻辑
  const { state: template } = useStorageValue<string>(TEMPLATE)

  const info = useMemo(() => {
    return {
      hasSelector: template?.includes("$selector"),
      hasText: template?.includes("$text"),
      hasIdx: template?.includes("$idx")
    }
  }, [template])

  // 如果模板是 {[content:$text]},那么当$text不存在时，把整个[]的内容清空
  function handleCode(item: TargetNode) {
    function fillTemplate(src: string, key: string, value: string | number) {
      // 如果值存在，则用其替换 [] 内的 key，并保留 [] 内的内容
      if (typeof value === "number") {
        src = src.replace(
          new RegExp(`\\[(.*?)\\${key}(.*?)\\]`, "g"),
          `$1${value}$2`
        )
      } else if (typeof value === "string" && value.length > 0) {
        src = src.replace(
          new RegExp(`\\[(.*?)\\${key}(.*?)\\]`, "g"),
          `$1"${value}"$2`
        )
      }
      // 如果值不存在或为空，则删除包含 key 的 [] 及内部的内容
      else {
        src = src.replace(new RegExp(`\\[.*?\\${key}.*?\\]`, "g"), "")
      }
      return src
    }
    // 先处理[]内的内容
    let src = template
    src = fillTemplate(src, "$text", item.content)
    src = fillTemplate(src, "$selector", item.selector)
    src = fillTemplate(src, "$idx", item.idx)

    // 再处理裸露的$
    src = src
      .replace("$text", item.content ? `"${item.content}"` : `undefined`)
      .replace("$selector", `"${item.selector}"`)
      .replace("$idx", `${item.idx}`)
    return src
  }
  return {
    info,
    template,
    handleCode
  }
}
