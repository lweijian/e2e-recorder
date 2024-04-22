import cssText from "data-text:~/style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useMemo, useState } from "react"

import SelectorRecorder from "~/selector-recorder"

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
  useEffect(() => {
    return () => {
      recorder.destroy()
    }
  }, [])

  useEffect(() => {
    console.log(recorderList)
  }, [recorderList])
  return (
    <div className="r-z-50 r-flex r-flex-col r-fixed r-top-32 r-right-8 r-bg-white r-border r-rounded-md r-p-3 r-w-[500px] r-h-[100px] r-overflow-auto">
      {recorderList.map((item, idx) => {
        return <div key={idx}>selector: {item.selector}</div>
      })}
    </div>
  )
}

export default RecorderOverlay
