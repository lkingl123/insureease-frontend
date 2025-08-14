'use client'

import Spinner from './Spinner'

type SubmitButtonProps = {
  loading: boolean
  label?: string
  className?: string // optional extra styling from parent
}

export default function SubmitButton({
  loading,
  label = 'Submit',
  className = '',
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading}
      className={`w-full flex items-center justify-center gap-2 font-bold text-lg py-3 rounded-lg transition-colors
        bg-brand-orange text-white hover:bg-orange-600 disabled:opacity-70 disabled:cursor-not-allowed
        ${className}`}
    >
      {loading && <Spinner />}
      {label}
    </button>
  )
}
