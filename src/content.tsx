import cssText from "data-text:~/style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect } from "react"
import { RecoilRoot, useRecoilValue, useSetRecoilState } from "recoil"

import SelectorRecorder from "~/selector-recorder"
import { selectorListAtom } from "~/store"

export const config: PlasmoCSConfig = {
  matches: ["https://ads.tiktok.com/*", "http://127.0.0.1:8080/*"]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}
const RecorderOverlay = () => {
  const selectorList = useRecoilValue(selectorListAtom)
  const setSelectorListAtom = useSetRecoilState(selectorListAtom)
  useEffect(() => {
    const recorder = new SelectorRecorder(setSelectorListAtom)
    return () => {
      recorder.destroy()
    }
  }, [])
  return (
    <RecoilRoot>
      <div className="recorder-z-50 recorder-flex recorder-fixed recorder-top-32 recorder-right-8">
        {selectorList.map((item) => {
          return <div>selector: {item.selector}</div>
        })}
      </div>
    </RecoilRoot>
  )
}

export default RecorderOverlay
