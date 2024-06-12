import { useCallback, useEffect } from "react"

import type { Source, TargetNode } from "~/selector-recorder"
import { removeEmptyStr } from "~/utils"

import type useTemplate from "./useTemplate"

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

    sources.forEach((source) => {
      source.styleSheets[0].insertRule(rule1, 0)
      source.styleSheets[0].insertRule(rule2, 1)
    })
    return () => {
      sources.forEach((source) => {
        source.styleSheets[0].deleteRule(1)
        source.styleSheets[0].deleteRule(0)
      })
    }
  }, [sources])

  const getDom = useCallback(
    function (item: TargetNode) {
      const { selector, idx, content, source } = item
      if (removeEmptyStr(selector).length === 0) {
        return undefined
      }
      let res: Element[] = Array.from(source.querySelectorAll(selector))
      if (info?.hasIdx) {
        res = [res[idx]]
      }
      if (info?.hasText && content) {
        res = res.filter((element) => {
          return (element as unknown as HTMLElement).innerText.includes(content)
        })
      }
      return res
    },
    [info]
  )

  const highlightDom = (item: TargetNode) => {
    const doms = getDom(item)
    doms?.forEach((dom) => dom?.classList?.add("hightlight-dom"))
  }

  const removeHighLightDom = (item: TargetNode) => {
    const doms = getDom(item)
    doms?.forEach((dom) => dom?.classList?.remove("hightlight-dom"))
  }
  return {
    highlightDom,
    removeHighLightDom
  }
}
