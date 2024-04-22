import { Storage } from "@plasmohq/storage"

// 缓存上次用户拖拽的ui界面的位置
export const POSITION = "position"
// 是否展示ui界面
export const SHOW_CONTENT_UI = "show_content_ui"
//  如果无法用data-testId定位，是否用点击元素的类生成选择器{" "}
export const GENERATE_BY_CLASS = "generateByClass"
export const GENERATE_BY_CLASS_STORE = new Storage()
// 缓存模板
export const TEMPLATE = "template"
