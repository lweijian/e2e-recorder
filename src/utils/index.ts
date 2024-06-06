export function getInfoBySelector(selector: string, target: HTMLElement) {
  if (removeEmptyStr(selector).length === 0) {
    return {
      count: 0,
      idx: -1
    }
  }
  const domList = document.querySelectorAll(selector)
  const idx =
    domList.length === 1
      ? 0
      : Array.from(domList).findIndex((i) => i === target)
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
