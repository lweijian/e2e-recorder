import { useReducer } from "react"

export const CountButton = () => {
  const [count, increase] = useReducer((c) => c + 1, 0)

  return (
    <button
      onClick={() => increase()}
      type="button"
      className="recorder-flex recorder-flex-row recorder-items-center recorder-px-4 recorder-py-2 recorder-text-sm recorder-rounded-lg recorder-transition-all recorder-border-none
      recorder-shadow-lg hover:recorder-shadow-md
      active:recorder-scale-105 recorder-bg-slate-50 hover:recorder-bg-slate-100 recorder-text-slate-800 hover:recorder-text-slate-900">
      Count:
      <span className="recorder-inline-flex recorder-items-center recorder-justify-center recorder-w-8 recorder-h-4 recorder-ml-2 recorder-text-xs recorder-font-semibold recorder-rounded-full">
        {count+1}
      </span>
    </button>
  )
}
