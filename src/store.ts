import { atom } from "recoil"

import type { TargetNode } from "~/selector-recorder"

export const selectorListAtom = atom<TargetNode[]>({
  key: "selectorList", // unique ID (with respect to other atoms/selectors)
  default: []
})
