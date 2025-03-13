import { useCallback, useEffect } from "react"

import type { Source, TargetNode } from "~/selector-recorder"
import { removeEmptyStr } from "~/utils"

import type useTemplate from "./useTemplate"

// 安全地检查是否可以访问文档
const canAccessDocument = (doc: Document): boolean => {
  try {
    return !!doc.head
  } catch (e) {
    return false
  }
}

export default function useHighLightDom(
  info: ReturnType<typeof useTemplate>["info"],
  sources: Source[]
) {
  useEffect(() => {
    const rule1 = `
      .hightlight-dom{
        background-color: rgba(255,0,0,.3) !important;
        position:relative;
      }
      `
    const rule2 = `
      .hightlight-dom::after{ 
        position:absolute;
        content:'';
        width:100%;
        height:100%;
        outline:1px solid red;
        z-index:999;
        top:0;
        left:0;
      }
      `

    // 创建并附加样式表，而不是修改现有的
    const createdStylesheets = sources
      .filter(canAccessDocument)
      .map((source) => {
        try {
          // 创建新的样式元素
          const styleSheet = source.createElement("style")
          styleSheet.textContent = `${rule1}\n${rule2}`
          source.head?.appendChild(styleSheet)
          return { source, styleSheet }
        } catch (e) {
          console.warn("Failed to create stylesheet:", e)
          return null
        }
      })
      .filter(Boolean)

    // 清理函数
    return () => {
      createdStylesheets.forEach((item) => {
        if (item) {
          try {
            item.source.head?.removeChild(item.styleSheet)
          } catch (e) {
            console.warn("Failed to remove stylesheet:", e)
          }
        }
      })
    }
  }, [sources])

  const getDom = useCallback(
    function (item: TargetNode) {
      const { selector, idx, content, source_info } = item
      if (removeEmptyStr(selector).length === 0) {
        return undefined
      }

      try {
        let res: Element[] = Array.from(
          source_info.observedElement.querySelectorAll(selector)
        )
        if (info?.hasText && content) {
          res = res.filter((element) => {
            return (element as unknown as HTMLElement).innerText.includes(
              content
            )
          })
        }
        if (info?.hasIdx) {
          res = [res[idx]]
        }

        return res
      } catch (e) {
        console.warn("Failed to query elements:", e)
        return undefined
      }
    },
    [info]
  )

  const highlightDom = (item: TargetNode) => {
    try {
      const doms = getDom(item)
      doms?.forEach((dom) => dom?.classList?.add("hightlight-dom"))
    } catch (e) {
      console.warn("Failed to highlight dom:", e)
    }
  }

  const removeHighLightDom = (item: TargetNode) => {
    try {
      const doms = getDom(item)
      doms?.forEach((dom) => dom?.classList?.remove("hightlight-dom"))
    } catch (e) {
      console.warn("Failed to remove highlight from dom:", e)
    }
  }

  return {
    highlightDom,
    removeHighLightDom
  }
}
