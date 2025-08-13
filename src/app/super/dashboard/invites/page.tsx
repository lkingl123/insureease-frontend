'use client'

import { useState, useEffect } from 'react'
import type { InviteWithEntity, EntityWithUsers } from '../../../../types/dashboard'

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
      fetch('/api/invites').then(res => res.json()).then(setInvites),
    ]).finally(() => setLoading(false))
  }, [])

  const sendInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const res = await fetch('/api/invites', {
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

    const res = await fetch('/api/invites', {
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
    <main className="container py-4">
      <section className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h1 className="is-large mb-1">Invite Users</h1>
              <p className="text-muted mb-3">Send role-based invites to entity users.</p>

              <form onSubmit={sendInvite} className="row gap">
                <div className="col-4">
                  <label className="label">Email</label>
                  <input
                    type="email"
                    className="input w-full"
                    placeholder="user@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="col-3">
                  <label className="label">Role</label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    className="input w-full"
                    required
                  >
                    <option value="">Select Role</option>
                    <option value="entity_admin">Entity Admin</option>
                    <option value="cred_specialist">Credentialing Specialist</option>
                    <option value="provider">Provider</option>
                  </select>
                </div>

                <div className="col-3">
                  <label className="label">Entity</label>
                  <select
                    value={entityId}
                    onChange={e => setEntityId(e.target.value)}
                    className="input w-full"
                    required
                  >
                    <option value="">Select Entity</option>
                    {entities.map(entity => (
                      <option key={entity.id} value={entity.id}>{entity.name}</option>
                    ))}
                  </select>
                </div>

                <div className="col-2" style={{ marginTop: '2rem' }}>
                  <button type="submit" className="button is-primary w-full" disabled={submitting}>
                    {submitting ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h2 className="is-medium mb-2">Pending Invites</h2>
              {loading ? (
                <p className="text-muted">Loading invites...</p>
              ) : invites.length === 0 ? (
                <p className="text-muted">No pending invites found.</p>
              ) : (
                <div className="overflow-auto">
                  <table className="table is-fullwidth is-bordered is-striped">
                    <thead>
                      <tr>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Entity</th>
                        <th>Status</th>
                        <th>Sent</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invites.map(invite => (
                        <tr key={invite.id}>
                          <td>{invite.email}</td>
                          <td>{invite.role}</td>
                          <td>{invite.entity?.name || '-'}</td>
                          <td>{invite.used ? '✅ Valid' : '⏳ Pending'}</td>
                          <td>{new Date(invite.createdAt).toLocaleDateString()}</td>
                          <td>
                            {!invite.used && (
                              <button
                                onClick={() => handleDelete(invite.token)}
                                className="button is-small is-danger"
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
          </div>
        </div>
      </section>
    </main>
  )
}
