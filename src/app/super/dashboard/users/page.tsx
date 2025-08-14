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
    <main className="container" style={{ paddingTop: '3rem' }}>
      <BackButton />
      <h1 className="is-large mb-4">All Users</h1>
      {loading ? (
        <p>Loading users...</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="table is-fullwidth">
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Entity</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <ToggleUser
                    userId={user.id}
                    initialStatus={user.status}
                    onSuccess={() => router.refresh()}
                  />
                </td>
                <td>{user.entity?.name ?? '—'}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="button is-small is-danger"
                    onClick={() => deleteUser(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  )
}
