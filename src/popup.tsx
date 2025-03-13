import { Input, Switch } from "@arco-design/web-react"

import { CountButton } from "./features/count-button"

import "~/style.css"
import "@arco-design/web-react/dist/css/arco.css"

import useStorageValue from "./hooks/useStorageValue"
import useStore, { SHOW_CONTENT_UI, TEMPLATE } from "./hooks/useStore"

function IndexPopup() {
  const [showContent, setShowContent] = useStore(SHOW_CONTENT_UI)
  const { state, onChange } = useStorageValue(TEMPLATE)
  return (
    <div className="flex-col p-5 items-center justify-center w-[500px]">
      <div className="flex items-center justify-between w-full mb-2">
        <div className="text-md text-gray-500">代码模板</div>
        <div className="text-md text-gray-500 flex items-center">
          启用插件
          <Switch
            checked={showContent}
            className="ml-2 mb-[2px]"
            onChange={setShowContent}
          />
        </div>
      </div>
      {/* <div>
        如果无法用data-testId定位，是否用点击元素的类生成选择器{" "}
        <Switch checked={generateByClass} onChange={setGenerageByClass} />
      </div> */}
      <div>
        <li className="text-xs text-gray-500">
          支持$text，$selector，$idx变量，其中 $text 为元素的文本，$selector
          为元素的选择器，$idx 为元素在页面中的顺序。
        </li>
        <li className="text-xs text-gray-500">
          {
            "\n[] 内的内容表示可选，如：[text:$text] 代表当 $text 不存在时，不生成这部分代码。"
          }
        </li>
        <li className="text-xs text-gray-500 mb-2">
          {
            "\n不妨试试 this.page.elements({ [text:$text, ]css:$selector }).index($idx);"
          }
        </li>
        <Input.TextArea
          style={{ height: "100px" }}
          value={state}
          onChange={onChange}
        />
      </div>
    </div>
  )
}

export default IndexPopup
