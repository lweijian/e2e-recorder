import { IconDragDotVertical } from "@arco-design/web-react/icon"
import cssText from "data-text:~/style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useMemo, useRef, useState } from "react"
import Draggable from "react-draggable" // The default

import { useStorage } from "@plasmohq/storage/hook"

import SelectorRecorder from "~/selector-recorder"

import { SHOW_CONTENT_UI } from "./hooks/storageKeys"
import useStoragePosition from "./hooks/useStoragePosition"

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
  const [recorderList, setRecorderList] = useState([])
  const recorder = useMemo(() => new SelectorRecorder(setRecorderList), [])
  const [show] = useStorage(SHOW_CONTENT_UI)
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
  return show ? (
    <Draggable
      onDrag={onDrag}
      position={position}
      handle="#recorder-drag-icon"
      bounds={{
        left: 0,
        top: 0,
        right: document.body.clientWidth - 50,
        bottom: document.body.clientHeight - 50
      }}>
      <div className="r-z-50 r-flex r-flex r-top-0 r-left-0 r-bg-white r-border r-rounded-lg r-p-3 r-min-w-[600px]  r-h-[300px] r-shadow-xl r-relative">
        <IconDragDotVertical
          className="r-w-[15px] r-h-[15px] r-mt-[3px]	r-cursor-move r-absolute r-left-3 r-top-3"
          id="recorder-drag-icon"
        />
        <div
          className="r-flex-col r-ml-[7px] r-pl-[20px] r-w-full r-h-full r-overflow-auto r-pr-10"
          ref={scrollRef}>
          {recorderList.map((item, idx) => {
            return (
              <div className="r-break-all	r-mb-3" key={idx}>
                {item.selector}
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
