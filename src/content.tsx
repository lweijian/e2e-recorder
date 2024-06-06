import { IconDragDotVertical } from "@arco-design/web-react/icon"
import cssText from "data-text:~/style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useMemo, useState } from "react"
import Draggable from "react-draggable" // The default
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

import SelectorRecorder, { type TargetNode } from "~/selector-recorder"

import useHighLightDom from "./hooks/useHighlightDom"
import useScrollToBottom from "./hooks/useScrollToBottom"
import useStorageValue from "./hooks/useStorageValue"
import useStore, { POSITION, SHOW_CONTENT_UI, TEMPLATE } from "./hooks/useStore"
import useTemplate from "./hooks/useTemplate"
import { copyText } from "./utils"

export const config: PlasmoCSConfig = {
  matches: [
    "https://ads.tiktok.com/*",
    "http://127.0.0.1:8080/*",
    "http://localhost:8080/*",
    "https://portal.bitsnaastest.com/*"
  ]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}
const RecorderOverlay = () => {
  const [recorderList, setRecorderList] = useState<TargetNode[]>([])
  const recorder = useMemo(() => new SelectorRecorder(setRecorderList), [])
  const [show] = useStore(SHOW_CONTENT_UI)
  const { state, onChange } = useStorageValue(POSITION)
  useEffect(() => {
    return () => {
      recorder.destroy()
    }
  }, [])

  const scrollRef = useScrollToBottom(recorderList)
  const { handleCode } = useTemplate()

  const { highlightDom, removeHighLightDom } = useHighLightDom()
  return show ? (
    <Draggable
      onDrag={(e, { x, y }) => onChange({ x, y })}
      position={state}
      handle="#recordedrag-icon"
      bounds={{
        left: 0,
        top: 0,
        right: document.body.clientWidth - 50,
        bottom: document.body.clientHeight - 50
      }}>
      <div className="z-50 flex top-0 left-0 bg-white border rounded-lg p-3 min-w-[600px]  h-[300px] shadow-xl relative ">
        <IconDragDotVertical
          className="w-[15px] h-[15px] mt-[3px]	cursor-move absolute left-3 top-3"
          id="recordedrag-icon"
        />
        <div
          className="flex-col ml-[7px] px-[20px] w-full h-full overflow-auto overflow-x-hidden p10"
          ref={scrollRef}>
          {recorderList.map((item, idx) => {
            const code = handleCode(item)
            return (
              <div
                className="break-all	mb-3 animate__fadeInRight"
                key={idx}
                onMouseEnter={() => highlightDom(item)}
                onMouseLeave={() => removeHighLightDom(item)}>
                <SyntaxHighlighter
                  language="javascript"
                  style={vscDarkPlus}
                  onClick={() => {
                    copyText(code)
                  }}>
                  {code}
                </SyntaxHighlighter>
              </div>
            )
          })}
        </div>
      </div>
    </Draggable>
  ) : (
    <></>
  )
}

export default RecorderOverlay
