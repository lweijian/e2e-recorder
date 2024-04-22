import { Switch } from "@arco-design/web-react"

import { useStorage } from "@plasmohq/storage/hook"

import { CountButton } from "~/features/count-button"

import "~/style.css"
import "@arco-design/web-react/dist/css/arco.css"

import {
  GENERATE_BY_CLASS,
  GENERATE_BY_CLASS_STORE,
  SHOW_CONTENT_UI
} from "./hooks/storageKeys"

function IndexPopup() {
  const [showContent, setShowContent] = useStorage(SHOW_CONTENT_UI)
  const [generateByClass, setGenerageByClass] = useStorage({
    key: GENERATE_BY_CLASS,
    instance: GENERATE_BY_CLASS_STORE
  })
  return (
    <div className="r-flex-col r-p-5 r-items-center r-justify-center r-w-[500px]">
      <div>
        展示浮窗 <Switch checked={showContent} onChange={setShowContent} />
      </div>
      <div>
        如果无法用data-testId定位，是否用点击元素的类生成选择器{" "}
        <Switch checked={generateByClass} onChange={setGenerageByClass} />
      </div>
      <CountButton />
    </div>
  )
}

export default IndexPopup
