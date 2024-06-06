import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

// 缓存上次用户拖拽的ui界面的位置
export const POSITION = "position"
// 是否展示ui界面
export const SHOW_CONTENT_UI = "show_content_ui"
//  如果无法用data-testId定位，是否用点击元素的类生成选择器{" "}
export const GENERATE_BY_CLASS = "generateByClass"
// 缓存模板
export const TEMPLATE = "template"

export const CONFIG_STORE = new Storage()

export type StorageKey =
  | typeof POSITION
  | typeof SHOW_CONTENT_UI
  | typeof GENERATE_BY_CLASS
  | typeof TEMPLATE
export default function useStore(key: StorageKey) {
  return useStorage({
    instance: CONFIG_STORE,
    key
  })
}
