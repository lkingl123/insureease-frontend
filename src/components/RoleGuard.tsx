'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Role = 'super_admin' | 'entity_admin' | 'cred_specialist' | 'provider'

export function RoleGuard({
  required,
  children,
}: {
  required: Role[]
  children: React.ReactNode
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const res = await fetch('/api/me', { credentials: 'include' })
        if (!res.ok) throw new Error('Unauthorized')

        const data = await res.json()
        const role = data.role as Role | undefined

        if (!role || !required.includes(role)) {
          return router.replace('/unauthorized')
        }
      } catch (err) {
        router.replace('/login')
      } finally {
        setLoading(false)
      }
    }

    checkAccess()
  }, [router, required])

  if (loading) return <p>Loading...</p>

  return <>{children}</>
}
