'use client'

import { useState } from 'react'

type ToggleProps = {
  userId: string
  initialStatus: 'active' | 'inactive'
  onSuccess: () => void
}

export default function ToggleUser({ userId, initialStatus, onSuccess }: ToggleProps) {
  const [checked, setChecked] = useState(initialStatus === 'active')
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    const newStatus = checked ? 'inactive' : 'active'
    setLoading(true)

    try {
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, newStatus }),
      })

      if (!res.ok) throw new Error('Update failed')

      setChecked(!checked)
      onSuccess()
    } catch (err) {
      alert('❌ Error updating status.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <label className="toggle-switch" style={{ opacity: loading ? 0.6 : 1 }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={handleToggle}
          disabled={loading}
        />
        <span className="slider" />
      </label>

      <style jsx>{`
        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 42px;
          height: 24px;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          background-color: #ccc;
          border-radius: 24px;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          transition: 0.3s;
        }

        .slider:before {
          position: absolute;
          content: '';
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          border-radius: 50%;
          transition: 0.3s;
        }

        input:checked + .slider {
          background-color: #4caf50;
        }

        input:checked + .slider:before {
          transform: translateX(18px);
        }
      `}</style>
    </>
  )
}
