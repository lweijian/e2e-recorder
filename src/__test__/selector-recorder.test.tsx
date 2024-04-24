import { describe, expect, test } from "vitest"

import { render } from "~/tests/test-utils"

describe("处理selector生成的各种情况", () => {
  test("first", async () => {
    const { getByText } = render(<div>1</div>)
    expect(getByText("1")).toMatchInlineSnapshot(`
      <div>
        1
      </div>
    `)
  })
})
