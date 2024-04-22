import { Switch } from "@arco-design/web-react"

import { useStorage } from "@plasmohq/storage/hook"

import { CountButton } from "~/features/count-button"

import "~/style.css"
import "@arco-design/web-react/dist/css/arco.css"

import { SHOW_CONTENT_UI } from "./hooks/storageKeys"

function IndexPopup() {
  const [showContent, setShowContent] = useStorage(SHOW_CONTENT_UI)
  return (
    <div className="r-flex-col r-p-5 r-items-center r-justify-center ">
      <div>
        展示浮窗 <Switch checked={showContent} onChange={setShowContent} />
      </div>
      <CountButton />
    </div>
  )
}

export default IndexPopup
