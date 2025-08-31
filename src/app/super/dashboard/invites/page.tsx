'use client'

import { useState, useEffect } from 'react'
import type { InviteWithEntity, EntityWithUsers } from '../../../../types/dashboard'
import BackButton from '@/components/BackButton'
import SubmitButton from '@/components/SubmitButton'

export default function InviteListPage() {
  const [invites, setInvites] = useState<InviteWithEntity[]>([])
  const [entities, setEntities] = useState<EntityWithUsers[]>([])
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [entityId, setEntityId] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/api/entities').then(res => res.json()).then(setEntities),
      fetch('/api/invite').then(res => res.json()).then(setInvites),
    ]).finally(() => setLoading(false))
  }, [])

  const sendInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const res = await fetch('/api/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role, entityId }),
    })

    if (res.ok) {
      const { invite } = await res.json()
      setInvites(prev => [invite, ...prev])
      setEmail('')
      setRole('')
      setEntityId('')
    } else {
      const error = await res.json()
      alert(error.error || 'Failed to send invite')
    }

    setSubmitting(false)
  }

  const handleDelete = async (token: string) => {
    if (!confirm('Are you sure you want to delete this invite?')) return

    const res = await fetch('/api/invite', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })

    if (res.ok) {
      setInvites(prev => prev.filter(i => i.token !== token))
    } else {
      const error = await res.json()
      alert(error.error || 'Failed to delete invite')
    }
  }

  return (
    <main className="min-h-screen bg-brand-light/30">
      <div className="mx-auto max-w-5xl px-4 pt-12 pb-16">
        
        <BackButton />

        {/* Invite Form */}
        <section className="mb-8 mt-6 bg-white rounded-2xl shadow-lg ring-1 ring-brand-muted/40 p-6">
          <h1 className="text-2xl font-bold text-brand-gray mb-1">Invite Users</h1>
          <p className="text-sm text-brand-gray/70 mb-6">
            Send role-based invites to entity users.
          </p>

          <form
            onSubmit={sendInvite}
            className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end"
          >
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-brand-gray mb-1">Email</label>
              <input
                type="email"
                className="w-full rounded-lg border border-brand-muted/40 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                placeholder="user@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-brand-gray mb-1">Role</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full rounded-lg border border-brand-muted/40 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                required
              >
                <option value="">Select Role</option>
                <option value="entity_admin">Entity Admin</option>
                <option value="cred_specialist">Credentialing Specialist</option>
                <option value="provider">Provider</option>
              </select>
            </div>

            {/* Entity + Submit Button in flex row */}
            <div className="md:col-span-2 flex gap-2 items-end">
              {/* Entity Dropdown */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-brand-gray mb-1">Entity</label>
                <select
                  value={entityId}
                  onChange={e => setEntityId(e.target.value)}
                  className="w-full rounded-lg border border-brand-muted/40 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  required
                >
                  <option value="">Select Entity</option>
                  {entities.map(entity => (
                    <option key={entity.id} value={entity.id}>
                      {entity.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <div className="self-end">
                <SubmitButton loading={submitting} label="Send Invite"  className="py-2 text-sm font-medium min-w-[120px]" />
              </div>
            </div>
          </form>
        </section>

        {/* Invite Table */}
        <section className="bg-white rounded-2xl shadow-lg ring-1 ring-brand-muted/40 overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-brand-gray mb-4">Pending Invites</h2>
            {loading ? (
              <p className="text-brand-gray/70">Loading invites...</p>
            ) : invites.length === 0 ? (
              <p className="text-brand-gray/70">No pending invites found.</p>
            ) : (
              <div className="overflow-x-auto ring-1 rounded-xl ring-brand-muted/30">
                <table className="min-w-full divide-y divide-brand-muted/40">
                  <thead className="bg-brand-light/50">
                    <tr>
                      {['Email', 'Role', 'Entity', 'Status', 'Sent', 'Actions'].map(h => (
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
                    {invites.map(invite => (
                      <tr key={invite.id} className="hover:bg-brand-light/20">
                        <td className="px-4 py-3 text-sm text-brand-gray">{invite.email}</td>
                        <td className="px-4 py-3 text-sm text-brand-gray">{invite.role}</td>
                        <td className="px-4 py-3 text-sm text-brand-gray">
                          {invite.entity?.name || '—'}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {invite.used ? '✅ Valid' : '⏳ Pending'}
                        </td>
                        <td className="px-4 py-3 text-sm text-brand-gray">
                          {new Date(invite.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          {!invite.used && (
                            <button
                              onClick={() => handleDelete(invite.token)}
                              className="inline-flex items-center justify-center rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600 transition-colors"
                            >
                              🗑️ Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
