import { useReducer } from "react"

export const CountButton = () => {
  const [count, increase] = useReducer((c) => c + 1, 0)

  return (
    <button
      onClick={() => increase()}
      type="button"
      className="r-flex r-flex-row r-items-center r-px-4 r-py-2 r-text-sm r-rounded-lg r-transition-all r-border-none
      r-shadow-lg hover:r-shadow-md
      active:r-scale-105 r-bg-slate-50 hover:r-bg-slate-100 r-text-slate-800 hover:r-text-slate-900">
      Count:
      <span className="r-inline-flex r-items-center r-justify-center r-w-8 r-h-4 r-ml-2 r-text-xs r-font-semibold r-rounded-full">
        {count + 1}
      </span>
    </button>
  )
}
