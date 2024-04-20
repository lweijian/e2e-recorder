
export interface TargetNode {
    selector: string
    content: string
}

// todo 改造成react组件
export class SelectorRecorder {
    tree: Object = {};
    counter: Object = {};
    interactiveTags: string[] = ['button', 'a', 'input', 'select', 'textarea'];
    private preEventTarget: EventTarget | null = null;
    private timerId: number | null = null;
    private setSelectorList;

    constructor(setSelectorList) {
        this.setSelectorList = setSelectorList;
        this.run();
    }

    private _traverseDOM(element: HTMLElement) {
        this.tree = {};
        this.counter = {};

        const dfs = (node: HTMLElement, tree: Record<string, any>) => {
            if (node.dataset && node.dataset.testid) {
                const testid = node.dataset.testid;

                if (!this.counter[testid]) {
                    this.counter[testid] = 0;
                }
                this.counter[testid]++;

                if (!tree[testid]) {
                    tree[testid] = [];
                }

                Array.from(node.children).forEach((childNode: Element) => {
                    let subtree = {};
                    dfs(childNode as HTMLElement, subtree);
                    if (Object.keys(subtree).length > 0) {
                        tree[testid].push(subtree);
                    }
                });
            } else {
                Array.from(node.children).forEach((childNode: Element) => {
                    dfs(childNode as HTMLElement, tree);
                });
            }
        }

        dfs(element, this.tree);
        return {tree: this.tree, counter: this.counter};
    }

    private _bindTestIdClickEvents() {
        document.querySelectorAll('[data-testid]').forEach((element: Element) => {
            const htmlElement = element as HTMLElement;
            if (!htmlElement.dataset.isClickedEventBound) {
                htmlElement.addEventListener('click', this._buildClickHandler(htmlElement));
                htmlElement.dataset.isClickedEventBound = "true";
            }
        });
    }

    // 从子节点中选择没有testid的可交互节点
    private _traverseInteractiveChild(node: HTMLElement): HTMLElement | null {
        if (!node) {
            return null;
        }

        if (
            this.interactiveTags.includes(node.tagName.toLowerCase()) &&
            !node.dataset.testid
        ) {
            return node;
        }

        let targetChild = null;
        Array.from(node.children).some((childNode: Element) => {
            const result = this._traverseInteractiveChild(childNode as HTMLElement);
            if (result) {
                targetChild = result;
                return true;
            }
            return false;
        });
        return targetChild;
    }

    private _buildClickHandler(element: HTMLElement) {
        return (event: Event) => {
            event.stopPropagation();
            if (this.preEventTarget === event.target) {
                return;
            }
            this._printSelector(element, event);
            this.preEventTarget = null;
        };
    }

    private _printSelector(element: HTMLElement, event: Event) {
        const selector: string[] = [];
        let el: HTMLElement | null = element;
        // todo 这里的逻辑得想想怎么改 具体要获取哪些节点的content
        const interactiveChild: HTMLElement | null = this._traverseInteractiveChild(el);
        if (interactiveChild && interactiveChild !== el) {
            selector.push(interactiveChild.tagName.toLowerCase())
        }

        while (el && el.tagName.toLowerCase() !== 'body') {
            const testid = el.dataset.testid;
            if (testid) {
                const selectorStr = `[data-testid="${testid}"]`;
                selector.unshift(selectorStr);
                if (this.counter[testid] <= 1) {
                    break;
                }
            }
            el = el.parentElement;
        }
        const selectorStr = `${selector.join(' ')}`;

        this.setSelectorList?.((oldList: TargetNode[]) => [...oldList, {
            selector: selectorStr,
            content: interactiveChild?.textContent || ''
        }]);
        this.preEventTarget = event.target;
    }

    run() {
        'use strict';
        this.timerId = window.setInterval(() => {
            this._traverseDOM(document.body);
            this._bindTestIdClickEvents();
        }, 1000);
    }

    destroy() {
        // Stop the timer.
        if (this.timerId !== null) {
            clearInterval(this.timerId);
            this.timerId = null;
        }

        // Clear the tree and counter.
        this.tree = {};
        this.counter = {};

        // Unbind the click events.
        document.querySelectorAll('[data-testid]').forEach((element: Element) => {
            const htmlElement = element as HTMLElement;
            if (htmlElement.dataset.isClickedEventBound) {
                htmlElement.removeEventListener('click', this._buildClickHandler(htmlElement));
                delete htmlElement.dataset.isClickedEventBound;
            }
        });

        // Reset the preEventTarget.
        this.preEventTarget = null;
    }
}

export default SelectorRecorder;