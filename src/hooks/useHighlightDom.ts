import { useCallback, useEffect } from "react"

import type { TargetNode } from "~/selector-recorder"
import { removeEmptyStr } from "~/utils"

import type useTemplate from "./useTemplate"

export default function useHighLightDom(
  info: ReturnType<typeof useTemplate>["info"]
) {
  useEffect(() => {
    document.styleSheets[0].insertRule(
      `
      .hightlight-dom{
        background-color: rgba(255,0,0,.3) !important;
        position:relative;
      }
      `,
      0
    )
    document.styleSheets[0].insertRule(
      `
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
      `,
      1
    )
  }, [])

  const getDom = useCallback(
    function (item: TargetNode) {
      const { selector, idx, content } = item
      if (removeEmptyStr(selector).length === 0) {
        return undefined
      }
      let res: Element[] = Array.from(document.querySelectorAll(selector))
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
