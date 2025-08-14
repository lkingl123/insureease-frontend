'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ToggleUser from '@/components/ToggleUser'
import BackButton from '@/components/BackButton'

type User = {
  id: string
  email: string
  role: string
  status: 'active' | 'inactive'
  createdAt: string
  entity?: { name: string }
}

export default function AllUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(setUsers)
      .finally(() => setLoading(false))
  }, [])

  const deleteUser = async (id: string) => {
    if (!confirm('Delete this user?')) return

    await fetch('/api/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })

    router.refresh()
  }

  return (
    <main className="min-h-screen bg-brand-light/30">
      <div className="mx-auto max-w-5xl px-4 pt-12 pb-16">
        <div className="mb-6">
          <BackButton />
        </div>

        <h1 className="text-2xl font-bold text-brand-gray mb-4">All Users</h1>

        <section className="bg-white rounded-2xl shadow-lg ring-1 ring-brand-muted/40 overflow-hidden">
          {loading ? (
            <div className="py-10 text-center text-brand-gray">Loading users…</div>
          ) : users.length === 0 ? (
            <div className="py-10 text-center text-brand-gray/80">No users found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-brand-muted/40">
                <thead className="bg-brand-light/50">
                  <tr>
                    {['Email', 'Role', 'Status', 'Entity', 'Joined', 'Actions'].map(h => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-gray"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-muted/30 bg-white">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-brand-light/20">
                      <td className="px-4 py-3 text-sm text-brand-gray">{user.email}</td>
                      <td className="px-4 py-3 text-sm text-brand-gray">{user.role}</td>
                      <td className="px-4 py-3">
                        <ToggleUser
                          userId={user.id}
                          initialStatus={user.status}
                          onSuccess={() => router.refresh()}
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-brand-gray">
                        {user.entity?.name ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-brand-gray">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="inline-flex items-center justify-center rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
