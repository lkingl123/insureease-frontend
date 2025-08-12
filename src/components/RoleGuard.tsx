'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Role = 'super_admin' | 'entity_admin' | 'cred_specialist' | 'provider'

type MeResponse = {
  user: {
    id: string
    email: string
    name?: string
    role: Role
    entity: {
      id: string
      name: string
      slug: string
    } | null
  }
}

export function RoleGuard({
  required,
  children,
}: {
  required: Role[]
  children: React.ReactNode
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const checkRole = async () => {
      try {
        const res = await fetch('/api/me', { credentials: 'include' })
        if (!res.ok) throw new Error('Unauthorized')

        const data = (await res.json()) as MeResponse
        const role = data.user.role

        if (required.includes(role)) {
          setAuthorized(true)
        } else {
          router.replace('/unauthorized')
        }
      } catch (err) {
        router.replace('/login')
      } finally {
        setLoading(false)
      }
    }

    checkRole()
  }, [router, required])

  if (loading) return <p>🔒 Checking access...</p>
  if (!authorized) return null

  return <>{children}</>
}
