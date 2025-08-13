'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import SubmitButton from '@/components/SubmitButton'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      setLoading(false)

      if (res.ok) {
        const data = await res.json()
        const { role, entity } = data

        let redirectTo = '/unauthorized'

        if (role === 'super_admin') {
          redirectTo = '/super/dashboard'
        } else if (entity) {
          redirectTo = `/${entity}/dashboard`
        }

        router.push(redirectTo)
      } else {
        const data = await res.json()
        setError(data.error || 'Login failed')
      }
    } catch (err) {
      console.error(err)
      setLoading(false)
      setError('Something went wrong')
    }
  }

  return (
    <main className="container">
      <div className="card" style={{ maxWidth: '500px', margin: 'auto', marginTop: '10vh' }}>
        <h1 className="is-center">InsureEase Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="test@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="is-error"><strong>{error}</strong></p>}

          <div className="form-group">
            <SubmitButton loading={loading} label="Sign In" />
          </div>
        </form>
      </div>
    </main>
  )
}
