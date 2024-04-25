import { Switch } from "@arco-design/web-react"

import { useStorage } from "@plasmohq/storage/hook"

import { CountButton } from "~/features/count-button"

import "~/style.css"
import "@arco-design/web-react/dist/css/arco.css"

import useStore, { GENERATE_BY_CLASS, SHOW_CONTENT_UI } from "./hooks/useStore"

function IndexPopup() {
  const [showContent, setShowContent] = useStore(SHOW_CONTENT_UI)
  const [generateByClass, setGenerageByClass] = useStore(GENERATE_BY_CLASS)
  return (
    <div className="flex-col p-5 items-center justify-center w-[500px]">
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
