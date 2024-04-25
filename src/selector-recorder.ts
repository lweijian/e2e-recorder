import { debounce } from "lodash-es"

import { CONFIG_STORE, GENERATE_BY_CLASS } from "./hooks/useStore"

export interface TargetNode {
  selector: string
  content: string
  count: number
}

// todo 改造成react组件
export class SelectorRecorder {
  tree: Object = {}
  counter: Object = {}
  interactiveTags: string[] = ["button", "a", "input", "select", "textarea"]
  private preEventTarget: EventTarget | null = null
  private observer: MutationObserver | null = null
  private setSelectorList
  // 从store里读取配置
  private config: { [GENERATE_BY_CLASS]: boolean } = {
    [GENERATE_BY_CLASS]: false
  }

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
    // 给具有data-testId的元素 和 可交互元素注册事件
    document
      .querySelectorAll(`[data-testid],${this.interactiveTags.join(",")}`)
      .forEach((element: Element) => {
        const htmlElement = element as HTMLElement
        if (!htmlElement.dataset.isClickedEventBound) {
          htmlElement.addEventListener(
            "click",
            this._buildClickHandler(htmlElement),
            true
          )
          htmlElement.dataset.isClickedEventBound = "true"
        }
      })
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

  private _buildClickHandler(element: HTMLElement) {
    return (event: Event) => {
      // 去重，如果和上一次点击的dom元素一样，则不打印
      if (this.preEventTarget === event.target) {
        return
      }
      this._printSelector(element, event)
      this.preEventTarget = null
    }
  }

  // leading true trailing false实现只执行最前面的事件
  private _printSelector = (element: HTMLElement, event: Event) => {
    const selector: string[] = []
    let el: HTMLElement | null = element
    // todo 这里的逻辑得想想怎么改 具体要获取哪些节点的content
    const interactiveChild: HTMLElement | null =
      this._traverseInteractiveChild(el)

    // 如果自己本身就是可交互元素，并且没有testId的话 可以考虑作为selector的一部分
    if (interactiveChild /**  && interactiveChild !== el */) {
      selector.push(interactiveChild.tagName.toLowerCase())
    }

    let hasTestIdParent = false
    // 向上查找data-testId，直到引用唯一
    while (el && el.tagName.toLowerCase() !== "body") {
      const testid = el.dataset.testid
      if (testid) {
        const selectorStr = `[data-testid="${testid}"]`
        hasTestIdParent = true
        selector.unshift(selectorStr)
        if (this.counter[testid] <= 1) {
          break
        }
      }
      el = el.parentElement
    }
    //

    // 如果没有具有data-testId的父亲，就把自己的类选择器生成
    if (!hasTestIdParent /**&& generateByClass */) {
      selector.unshift(
        Array.from(element.classList)
          .map((i) => `.${i}`)
          .join("")
      )
    }

    // todo: check，如果遇到.arco-checkbox-target input这种没法唯一确定的，需要结合content/idx额外考虑
    const selectorStr = `${selector.join(" ")}`
    const count = document.querySelectorAll(selectorStr).length
    this._debounceSetSelectorList(selectorStr, selectorStr, count, event)
  }

  private _debounceSetSelectorList = debounce(
    (selector: string, content: string, count: number, event: Event) => {
      this.setSelectorList?.((oldList: TargetNode[]) => [
        ...oldList,
        {
          selector,
          content,
          count
        }
      ])
      this.preEventTarget = event.target
    },
    200
  )

  async run() {
    "use strict"
    // this.timerId = window.setInterval(() => {
    //   this._traverseDOM(document.body)
    //   this._bindTestIdClickEvents()
    // }, 1000)
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
    CONFIG_STORE.watch({
      [GENERATE_BY_CLASS]: ({ newValue }) => {
        this.config[GENERATE_BY_CLASS] = Boolean(newValue)
      }
    })
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
    document.querySelectorAll("[data-testid]").forEach((element: Element) => {
      const htmlElement = element as HTMLElement
      if (htmlElement.dataset.isClickedEventBound) {
        htmlElement.removeEventListener(
          "click",
          this._buildClickHandler(htmlElement)
        )
        delete htmlElement.dataset.isClickedEventBound
      }
    })

    // Reset the preEventTarget.
    this.preEventTarget = null
  }
}

export default SelectorRecorder
