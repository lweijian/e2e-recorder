import { debounce } from "lodash-es"

import { getInfoBySelector, hasTestId, removeEmptyStr } from "./utils"

export interface TargetNode {
  selector: string
  content: string
  count: number
  idx: number
}

// todo 改造成react组件
export class SelectorRecorder {
  tree: Object = {}
  counter: Object = {}
  interactiveTags: string[] = ["button", "a", "input", "select", "textarea"]
  private preEventTarget: EventTarget | null = null
  private observer: MutationObserver | null = null
  private setSelectorList: (
    args: (oldList: TargetNode[]) => TargetNode[]
  ) => void

  constructor(setSelectorList) {
    this.setSelectorList = setSelectorList
    this.run()
  }

  private _traverseDOM(element: HTMLElement) {
    this.tree = {}
    this.counter = {}

    const dfs = (node: HTMLElement, tree: Record<string, any>) => {
      if (node.dataset && node.dataset.testid) {
        const testid = node.dataset.testid
        if (!this.counter[testid]) {
          this.counter[testid] = 0
        }
        this.counter[testid]++

        if (!tree[testid]) {
          tree[testid] = []
        }

        Array.from(node.children).forEach((childNode: Element) => {
          let subtree = {}
          dfs(childNode as HTMLElement, subtree)
          if (Object.keys(subtree).length > 0) {
            tree[testid].push(subtree)
          }
        })
      } else {
        Array.from(node.children).forEach((childNode: Element) => {
          dfs(childNode as HTMLElement, tree)
        })
      }
    }

    dfs(element, this.tree)
    return { tree: this.tree, counter: this.counter }
  }

  private _isInteractiveChild(node: HTMLElement) {
    return this.interactiveTags.includes(node.tagName.toLowerCase())
  }

  private _bindTestIdClickEvents() {
    document.addEventListener("click", this._buildClickHandler(), true)
  }

  // 从子节点中选择没有testid的可交互节点
  private _traverseInteractiveChild(node: HTMLElement): HTMLElement | null {
    if (!node) {
      return null
    }

    if (this._isInteractiveChild(node) && !node.dataset.testid) {
      return node
    }

    let targetChild = null
    Array.from(node.children).some((childNode: Element) => {
      const result = this._traverseInteractiveChild(childNode as HTMLElement)
      if (result) {
        targetChild = result
        return true
      }
      return false
    })
    return targetChild
  }

  private _buildClickHandler() {
    return (event: Event) => {
      // 去重，如果和上一次点击的dom元素一样，则不打印
      if (this.preEventTarget === event.target) {
        return
      }
      this._printSelector(event.target as HTMLElement, event)
      this.preEventTarget = null
    }
  }

  // leading true trailing false实现只执行最前面的事件
  private _printSelector = (element: HTMLElement, event: Event) => {
    const selector: string[] = []
    let el: HTMLElement | null = element

    // todo 这里的逻辑得想想怎么改 具体要获取哪些节点的content
    // const interactiveChild: HTMLElement | null =
    //   this._traverseInteractiveChild(el)

    // // 如果自己本身就是可交互元素，并且没有testId的话 可以考虑作为selector的一部分
    // if (interactiveChild /**  && interactiveChild !== el */) {
    //   selector.push(interactiveChild.tagName.toLowerCase())
    // }

    let hasParentTestId = false
    // 向上查找data-testId，直到引用唯一
    while (el && el.tagName.toLowerCase() !== "body") {
      const testid = el.dataset.testid
      if (testid) {
        const selectorStr = `[data-testid="${testid}"]`
        hasParentTestId = true
        selector.unshift(selectorStr)
        if (this.counter[testid] <= 1) {
          break
        }
      }
      el = el.parentElement
    }

    // 如果点击元素本身就有testid，则不需要进一步注入点击元素的类选择器
    if (!hasTestId(element)) {
      selector.push(
        Array.from(element.classList)
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
      )
    }
    const selectorStr = `${selector.join(" ")}`
    const { count, idx } = getInfoBySelector(selectorStr, element)

    // 只有在selector字符串有效，并且innerText不包含换行符时（误点击点击最外层的父元素，导致拿了所有子元素的innerText的集合）
    if (
      removeEmptyStr(selectorStr).length !== 0 &&
      !element.innerText?.includes("\n")
    ) {
      this._debounceSetSelectorList(
        selectorStr,
        element.innerText,
        count,
        idx,
        event
      )
    }
  }

  private _debounceSetSelectorList = debounce(
    (
      selector: string,
      content: string,
      count: number,
      idx: number,
      event: Event
    ) => {
      this.setSelectorList?.((oldList: TargetNode[]) => [
        ...oldList,
        {
          selector,
          content,
          count,
          idx
        }
      ])
      this.preEventTarget = event.target
    },
    300
  )

  async run() {
    "use strict"
    const fn = debounce(() => {
      console.log("监听到改变了")
      this._traverseDOM(document.body)
      this._bindTestIdClickEvents()
    }, 500)
    this.observer = new MutationObserver(fn)
    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: false,
      attributes: false
    })

    // 监听配置项的变化
    // CONFIG_STORE.watch({
    //   [GENERATE_BY_CLASS]: ({ newValue }) => {
    //     this.config[GENERATE_BY_CLASS] = Boolean(newValue)
    //   }
    // })
  }

  destroy() {
    // Stop the timer.
    if (this.observer !== null) {
      this.observer.disconnect()
      this.observer = null
    }

    // Clear the tree and counter.
    this.tree = {}
    this.counter = {}

    // Unbind the click events.
    document.removeEventListener("click", this._buildClickHandler())

    // Reset the preEventTarget.
    this.preEventTarget = null
  }
}

export default SelectorRecorder
