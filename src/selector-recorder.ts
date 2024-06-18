import { getInfoBySelector, hasTestId, removeEmptyStr } from "./utils"

export type Source = Document
export type SourceInfo = {
  observedElement: Source
  source_type: "iframe" | "document" | "web-component"
  // 在source_type为document时 不需要传入selector，e2e代码可以直接拿到
  source_selector?: string
}

export interface TargetNode {
  selector: string
  content: string
  count: number
  idx: number
  source_info: SourceInfo
}

export interface ObserverNode {
  observer: MutationObserver
  observedElement: Source
}

export class SelectorRecorder {
  private preEventTarget: EventTarget | null = null
  private observers: ObserverNode[] = []
  private setSelectorList: (
    args: (oldList: TargetNode[]) => TargetNode[]
  ) => void
  private handlerMap: Map<any, (event: Event) => void> = new Map()
  private setSource: (args: (oldList: Source[]) => Source[]) => void

  constructor(setSelectorList, setSource) {
    this.setSelectorList = setSelectorList
    this.setSource = setSource
    this.run({
      observedElement: document,
      source_type: "document",
      source_selector: "document"
    })
  }

  // 给每个根节点添加事件代理
  private _bindTestIdClickEvents(info: SourceInfo) {
    const { observedElement } = info
    const fn = (event: Event) => {
      // 去重，如果和上一次点击的dom元素一样，则不打印
      if (this.preEventTarget === event.target) {
        return
      }
      this._printSelector(event.target as HTMLElement, event, info)
      this.preEventTarget = null
    }
    if (!this.handlerMap.has(observedElement)) {
      this.handlerMap.set(observedElement, fn)
    }
    observedElement.addEventListener(
      "click",
      this.handlerMap.get(observedElement)
    )
  }

  // leading true trailing false实现只执行最前面的事件
  private _printSelector = (
    element: HTMLElement,
    event: Event,
    info: SourceInfo
  ) => {
    const selector: string[] = []
    let el: HTMLElement | null = element
    let cache_selector = []
    let preCount = -1

    // 向上查找data-testId，直到引用唯一
    while (el && el.tagName.toLowerCase() !== "body") {
      const testid = el.dataset.testid
      if (testid) {
        const selectorStr = `[data-testid='${testid}']`
        // 遇到第一个testId
        if (preCount === -1) {
          selector.unshift(selectorStr)
          const currentCount =
            info.observedElement.querySelectorAll(selectorStr).length
          console.log("第一次遇到id", selectorStr, currentCount)
          // 如果已经能确定了，则退出
          if (currentCount === 1) {
            break
          }
          preCount = currentCount
        } else {
          // 加上选择器后的数量
          const currentCount = info.observedElement.querySelectorAll(
            `${[selectorStr, ...selector].join(" ")}`
          ).length
          console.log(
            `新增了父级的选择器之后：${[selectorStr, ...selector].join(" ")}`,
            currentCount
          )
          // 如果加上选择器之后数量比没加选择器时一样，继续找
          if (currentCount === preCount) {
            cache_selector.push(selectorStr)
          }
          // 如果加上选择器之后数量比没加选择器时少，push到selector里
          else if (currentCount < preCount) {
            cache_selector.push(selectorStr)
            cache_selector.forEach((i) => selector.unshift(i))
            cache_selector = []
            if (currentCount <= 1) {
              break
            }
          }
          // 大于，没必要继续找了，break
          else if (currentCount > preCount) {
            break
          }

          preCount = currentCount
        }
      }
      el = el.parentElement
    }

    // 如果点击元素本身就有testid，则不需要进一步注入element.target元素的相关选择器
    if (!hasTestId(element)) {
      const classList = Array.from(element.classList)
      const classStr = classList
        // 过滤掉一些和交互相关的类，这些会导致选择器失效
        .filter(
          (i) =>
            !i.includes("active") &&
            !i.includes("hover") &&
            !i.includes("focus") &&
            !i.includes("selected") &&
            !i.includes("checked")
        )
        .map((i) => `.${i}`)
        .join("")
        .replaceAll("[", "\\\\[")
        .replaceAll("]", "\\\\]")
        .replaceAll("#", "\\\\#")
        .replaceAll(":", "\\\\:")
      const id = element.id
      if (id) {
        selector.push("#" + id)
      } else {
        // 优先级push兜底的选择器，进一步过滤
        selector.push(classStr || element.tagName.toLowerCase())
      }
    }

    const selectorStr = `${selector.join(" ")}`
    const { count, idx } = getInfoBySelector(
      selectorStr,
      element,
      info.observedElement
    )

    // 只有在selector字符串有效，并且innerText不包含换行符时（误点击点击最外层的父元素，导致拿了所有子元素的innerText的集合）
    if (
      removeEmptyStr(selectorStr).length !== 0 &&
      !element?.innerText?.includes("\n") &&
      !selectorStr.includes("plasmo-csui")
    ) {
      this.setSelectorList?.((oldList: TargetNode[]) => [
        ...oldList,
        {
          selector: selectorStr,
          content: element?.innerText,
          count,
          idx,
          event,
          source_info: info
        }
      ])
      this.preEventTarget = event.target
    }
  }

  async run(info: SourceInfo) {
    this._bindTestIdClickEvents(info)

    const fn = (mutations) => {
      // iframe
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          for (const node of mutation.addedNodes) {
            const iframes: HTMLIFrameElement[] =
              node?.getElementsByTagName?.("iframe") || []
            for (const iframe of iframes) {
              iframe.onload = () => {
                const iframeDoc =
                  iframe.contentDocument || iframe.contentWindow.document
                const index = this.observers.findIndex((observerNode) => {
                  return observerNode.observedElement === iframeDoc
                })
                if (index >= 0) return
                this.run({
                  observedElement: iframeDoc,
                  source_type: "iframe",
                  source_selector: `iframe[src*='${iframe.src}']`
                })
              }
            }
          }
        }
      }
    }
    const observer = new MutationObserver(fn)
    observer.observe(info.observedElement, {
      childList: true,
      subtree: true,
      characterData: false,
      attributes: false
    })
    this.observers.push({
      observedElement: info.observedElement,
      observer
    })
    this.setSource((oldList) => [
      ...new Set([...oldList, info.observedElement])
    ])
  }

  destroy() {
    // Stop the timer.
    if (this.observers.length > 0) {
      this.observers.forEach((observerNode) => {
        observerNode.observer.disconnect()
        // Clear the tree and counter.
        // Unbind the click events.
        observerNode.observedElement.removeEventListener(
          "click",
          this.handlerMap.get(observerNode.observedElement)
        )
      })
      this.observers = []
    }
    // Reset the preEventTarget.
    this.preEventTarget = null
  }
}

export default SelectorRecorder
