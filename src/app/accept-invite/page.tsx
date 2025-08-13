'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import SubmitButton from '@/components/SubmitButton'

export default function AcceptInvitePage() {
  const params = useSearchParams()
  const router = useRouter()
  const token = params.get('token')

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const isStrongPassword = (pwd: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
    return regex.test(pwd)
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    if (value.length === 0) {
      setPasswordError('')
    } else if (!isStrongPassword(value)) {
      setPasswordError(
        '❌ Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'
      )
    } else {
      setPasswordError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('❌ Passwords do not match.')
      return
    }

    if (!isStrongPassword(password)) {
      setPasswordError(
        '❌ Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'
      )
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/accept-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email, name, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(`❌ ${data.error || 'Something went wrong'}`)
        setLoading(false)
      } else {
        alert('✅ Account created. You can now log in.')
        router.push('/login')
      }
    } catch (err) {
      setError('❌ An unexpected error occurred.')
      setLoading(false)
    }
  }

  if (!token) return <p className="error">❌ Invalid invite link</p>

  return (
    <main
      className="container"
      style={{
        maxWidth: '400px',
        margin: '3rem auto',
        padding: '2rem',
        border: '1px solid #ddd',
        borderRadius: '8px',
        background: 'white',
        boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
      }}
    >
      <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Accept Invite</h1>

      <form onSubmit={handleSubmit} autoComplete="off">
        <div style={{ marginBottom: '1rem' }}>
          <input
            className="input rounded"
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <input
            className="input rounded"
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <input
            className="input rounded"
            type="password"
            placeholder="Create Password"
            value={password}
            onChange={e => handlePasswordChange(e.target.value)}
            required
          />
          {passwordError && <p className="error">{passwordError}</p>}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <input
            className="input rounded"
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {error && (
          <div style={{ marginBottom: '1rem' }}>
            <p className="error">{error}</p>
          </div>
        )}

        <SubmitButton loading={loading} label="Accept Invite" />
      </form>
    </main>
  )
}
