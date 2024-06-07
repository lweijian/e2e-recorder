import { Message } from "@arco-design/web-react"

export function getInfoBySelector(selector: string, target: HTMLElement) {
  if (removeEmptyStr(selector).length === 0) {
    return {
      count: 0,
      idx: -1
    }
  }
  const domList = document.querySelectorAll(selector)
  const idx = Array.from(domList).findIndex((i) => i === target)
  return {
    count: domList.length,
    idx
  }
}

export function hasTestId(element: HTMLElement, key = "testid") {
  return element.dataset[key] !== undefined
}

export function removeEmptyStr(str: string) {
  return str.replaceAll(" ", "").replaceAll("\n", "")
}

export function copyText(text: string) {
  const input = document.createElement("input")
  input.value = text
  document.body.appendChild(input)
  input.select()
  document.execCommand("copy")
  document.body.removeChild(input)
  Message.success("复制成功")
}
