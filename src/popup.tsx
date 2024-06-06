import { Input, Switch } from "@arco-design/web-react"

import "~/style.css"
import "@arco-design/web-react/dist/css/arco.css"

import useStorageValue from "./hooks/useStorageValue"
import useStore, { SHOW_CONTENT_UI, TEMPLATE } from "./hooks/useStore"

function IndexPopup() {
  const [showContent, setShowContent] = useStore(SHOW_CONTENT_UI)
  const { state, onChange } = useStorageValue(TEMPLATE)
  return (
    <div className="flex-col p-5 items-center justify-center w-[500px]">
      <div>
        展示浮窗 <Switch checked={showContent} onChange={setShowContent} />
      </div>
      {/* <div>
        如果无法用data-testId定位，是否用点击元素的类生成选择器{" "}
        <Switch checked={generateByClass} onChange={setGenerageByClass} />
      </div> */}
      <div>
        代码模板
        <div className="text-xs text-gray-500">
          支持$text,$selector,$idx变量，其中$text为元素的文本，$selector为元素的选择器，$idx为元素在页面中的顺序
        </div>
        <Input value={state} onChange={onChange} />
      </div>
    </div>
  )
}

export default IndexPopup
