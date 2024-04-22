import { IconDragDotVertical } from "@arco-design/web-react/icon"
import cssText from "data-text:~/style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useMemo, useState } from "react"
import Draggable from "react-draggable" // The default

import "@arco-design/web-react/dist/css/arco.css"

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

  const { position, onDrag } = useStoragePosition()
  const [disabled, setDisabled] = useState(true)
  return show ? (
    <Draggable
      onDrag={onDrag}
      disabled={disabled}
      position={position}
      bounds={{
        left: 0,
        top: 0,
        right: document.body.clientWidth - 50,
        bottom: document.body.clientHeight - 50
      }}>
      <div className="r-z-50 r-flex r-flex r-flex-start r-fixed r-top-0 r-left-0 r-bg-white r-border r-rounded-lg r-p-3 r-min-w-[500px] r-h-[100px] r-overflow-auto  r-shadow-xl">
        <IconDragDotVertical
          className="r-w-[15px] r-h-[15px] r-mt-[3px]	r-cursor-move "
          // 用捕获事件，交互会比冒泡好（响应更快）
          onMouseDownCapture={() => setDisabled(false)}
          onMouseUpCapture={() => setDisabled(true)}
        />
        <div className="r-flex-col r-ml-[7px]">
          {recorderList.map((item, idx) => {
            return <div key={idx}>selector: {item.selector}</div>
          })}
        </div>
      </div>
    </Draggable>
  ) : (
    <></>
  )
}

export default RecorderOverlay
