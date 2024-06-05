import { IconDragDotVertical } from "@arco-design/web-react/icon"
import cssText from "data-text:~/style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useMemo, useRef, useState } from "react"
import Draggable from "react-draggable" // The default

import SelectorRecorder, { type TargetNode } from "~/selector-recorder"

import useStoragePosition from "./hooks/useStoragePosition"
import useStore, { SHOW_CONTENT_UI } from "./hooks/useStore"

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
  useEffect(() => {
    return () => {
      recorder.destroy()
    }
  }, [])

  const scrollRef = useRef()

  useEffect(() => {
    const ele = scrollRef.current as HTMLElement
    if (ele) {
      ele.scrollTop = ele.scrollHeight
    }
  }, [recorderList])

  const { position, onDrag } = useStoragePosition()

  const highlightDom = (selector: string) => {
    console.log(selector)
    document.styleSheets[0].insertRule(
      `
      ${selector} { background-color: rgba(255,0,0,.3) !important;position:relative;border-radius: 5px; }
      `,
      0
    )
    document.styleSheets[0].insertRule(
      `
      ${selector}::after { position:absolute;content:'';width:100%;height:100%;border:1px solid red;z-index:999;border-radius: 5px;top:0;left:0;}
      `,
      1
    )
  }
  return show ? (
    <Draggable
      onDrag={onDrag}
      position={position}
      handle="#recordedrag-icon"
      bounds={{
        left: 0,
        top: 0,
        right: document.body.clientWidth - 50,
        bottom: document.body.clientHeight - 50
      }}>
      <div className="z-50 flex top-0 left-0 bg-white border rounded-lg p-3 min-w-[600px]  h-[300px] shadow-xl relative">
        <IconDragDotVertical
          className="w-[15px] h-[15px] mt-[3px]	cursor-move absolute left-3 top-3"
          id="recordedrag-icon"
        />
        <div
          className="flex-col ml-[7px] pl-[20px] w-full h-full overflow-auto p10"
          ref={scrollRef}>
          {recorderList.map((item, idx) => {
            return (
              <div
                className="break-all	mb-3"
                key={idx}
                onMouseEnter={() => highlightDom(item.selector)}
                onMouseLeave={() => {
                  document.styleSheets[0].removeRule(1)
                  document.styleSheets[0].removeRule(0)
                }}>
                {item.selector} {item.count}
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
