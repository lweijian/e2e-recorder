import { render } from "@testing-library/react"

const AllTheProviders = ({ children }) => {
  return <div>{children}</div>
}

const customRender = (ui, options?: any) =>
  render(ui, { wrapper: AllTheProviders, ...options })

// re-export everything
export * from "@testing-library/react"

// override render method
export { customRender as render }
