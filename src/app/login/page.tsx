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
    <main className="min-h-screen flex items-center justify-center bg-brand-light">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-brand-gray text-center mb-6">
          InsureEase Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-brand-gray mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="test@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-brand-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-brand-gray mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-brand-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
          </div>

          {/* Error message */}
          {error && (
            <p className="text-sm text-red-600 text-center font-semibold">
              {error}
            </p>
          )}

          {/* Submit */}
          <div>
            <SubmitButton
              loading={loading}
              label="Sign In"
              className="w-full bg-brand-orange text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
            />
          </div>
        </form>
      </div>
    </main>
  )
}
