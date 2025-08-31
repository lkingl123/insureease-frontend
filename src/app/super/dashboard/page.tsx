'use client'

import { useEffect, useState } from 'react'
import type { EntityWithUsers, InviteWithEntity } from '@/types/dashboard'

export default function SuperDashboardPage() {
  const [entities, setEntities] = useState<EntityWithUsers[]>([])
  const [invites, setInvites] = useState<InviteWithEntity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/entities').then(res => res.json()),
      fetch('/api/invite').then(res => res.json())
    ])
      .then(([entitiesData, invitesData]) => {
        setEntities(Array.isArray(entitiesData) ? entitiesData : [])
        setInvites(Array.isArray(invitesData) ? invitesData : [])
      })
      .finally(() => setLoading(false))
  }, [])

  const totalUsers = entities.reduce((sum, e) => sum + (e.users?.length ?? 0), 0)
  const pendingInvites = invites.filter((invite) => !invite.used).length

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-brand-gray">Welcome, Super Admin</h2>

      {loading ? (
        <div className="text-brand-gray/70">Loading dashboard data…</div>
      ) : (
        <>
          <section className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-xl p-4 bg-white shadow ring-1 ring-brand-muted/30">
              <h3 className="text-sm font-semibold text-brand-gray">Total Entities</h3>
              <p className="text-3xl font-bold mt-1">{entities.length}</p>
            </div>
            <div className="rounded-xl p-4 bg-white shadow ring-1 ring-brand-muted/30">
              <h3 className="text-sm font-semibold text-brand-gray">Pending Invites</h3>
              <p className="text-3xl font-bold mt-1">{pendingInvites}</p>
            </div>
            <div className="rounded-xl p-4 bg-white shadow ring-1 ring-brand-muted/30">
              <h3 className="text-sm font-semibold text-brand-gray">Total Users</h3>
              <p className="text-3xl font-bold mt-1">{totalUsers}</p>
            </div>
          </section>

          <section className="bg-white p-4 rounded-xl ring-1 ring-brand-muted/30 shadow">
            <h3 className="text-lg font-bold mb-2 text-brand-gray">Alerts & Notices</h3>
            <ul className="list-disc pl-5 text-sm text-brand-gray">
              <li>All systems operational.</li>
              <li>No new alerts at this time.</li>
            </ul>
          </section>
        </>
      )}
    </div>
  )
}
