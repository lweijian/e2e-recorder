import { useEffect } from "react"

import type { TargetNode } from "~/selector-recorder"
import { removeEmptyStr } from "~/utils"

export default function useHighLightDom() {
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

  function getClassList(item: TargetNode) {
    const { selector, idx } = item
    if (removeEmptyStr(selector).length === 0) {
      return undefined
    }
    const classList = Array.from(document.querySelectorAll(selector))[idx]
      ?.classList
    return classList
  }

  const highlightDom = (item: TargetNode) => {
    const classList = getClassList(item)
    classList?.add("hightlight-dom")
  }

  const removeHighLightDom = (item: TargetNode) => {
    const classList = getClassList(item)
    classList?.remove("hightlight-dom")
  }
  return {
    highlightDom,
    removeHighLightDom
  }
}
