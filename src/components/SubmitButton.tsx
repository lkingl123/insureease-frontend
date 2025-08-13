'use client'

import Spinner from './Spinner'

type SubmitButtonProps = {
  loading: boolean
  label?: string
}

export default function SubmitButton({ loading, label = 'Submit' }: SubmitButtonProps) {
  return (
    <button
      className="button primary full-width"
      type="submit"
      disabled={loading}
      style={{
        marginTop: '1.5rem',
        fontWeight: 'bold',
        fontSize: '1rem',
        padding: '0.75rem',
        borderRadius: '6px',
      }}
    >
      {loading && <Spinner />}
      {loading ? `${label}ing...` : label}
    </button>
  )
}
