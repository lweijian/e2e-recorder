export function getInfoBySelector(selector: string, target: HTMLElement) {
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
