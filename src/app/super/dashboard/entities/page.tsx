'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import BackButton from '@/components/BackButton'
import Spinner from '@/components/Spinner'

type Entity = {
  id: string
  name: string
  slug: string
  createdAt: string
  users?: { id: string }[]
}

export default function ManageEntitiesPage() {
  const router = useRouter()
  const [entities, setEntities] = useState<Entity[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    const res = await fetch('/api/entities', { cache: 'no-store' })
    const data = await res.json()
    setEntities(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this entity?')) return
    setLoadingId(id)
    await fetch('/api/entities', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setLoadingId(null)
    router.refresh()
    load()
  }

  const handleEdit = async (entity: Entity) => {
    const name = prompt('Enter new name', entity.name)
    if (!name) return
    const slug = prompt('Enter new slug', entity.slug)
    if (!slug) return

    setEditingId(entity.id)
    await fetch('/api/entities', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: entity.id, name, slug }),
    })
    setEditingId(null)
    router.refresh()
    load()
  }

  return (
    <main className="min-h-screen bg-brand-light/30">
      <div className="mx-auto max-w-5xl px-4 pt-12 pb-16">
        <div className="mb-6">
          <BackButton />
        </div>

        <section className="bg-white rounded-2xl shadow-lg ring-1 ring-brand-muted/40">
          <header className="flex items-center justify-between px-6 py-5 border-b border-brand-muted/50">
            <h1 className="text-2xl font-bold text-brand-gray">Manage Entities</h1>
          </header>

          <div className="px-6 py-6">
            {/* Create form (POST /api/entities) */}
            <form
              action="/api/entities"
              method="POST"
              className="mb-6 grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3"
            >
              <input
                name="name"
                placeholder="Entity Name"
                required
                className="w-full rounded-lg border border-brand-muted/80 bg-white px-4 py-2 text-sm text-brand-gray placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-orange"
              />
              <input
                name="slug"
                placeholder="Slug"
                required
                className="w-full rounded-lg border border-brand-muted/80 bg-white px-4 py-2 text-sm text-brand-gray placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-orange"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-brand-orange px-5 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-orange"
              >
                Add
              </button>
            </form>

            {/* Table / loading / empty */}
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <Spinner />
              </div>
            ) : entities.length === 0 ? (
              <p className="text-center text-brand-gray/80 py-8">No entities found.</p>
            ) : (
              <div className="overflow-x-auto rounded-xl ring-1 ring-brand-muted/30">
                <table className="min-w-full divide-y divide-brand-muted/40">
                  <thead className="bg-brand-light/50">
                    <tr>
                      {['Name', 'Slug', 'Users', 'Created', 'Actions'].map((h) => (
                        <th
                          key={h}
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-gray"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-muted/30 bg-white">
                    {entities.map((entity) => (
                      <tr key={entity.id} className="hover:bg-brand-light/20">
                        <td className="px-4 py-3 text-sm text-brand-gray">{entity.name}</td>
                        <td className="px-4 py-3 text-sm text-brand-gray">{entity.slug}</td>
                        <td className="px-4 py-3 text-sm text-brand-gray">
                          {entity.users?.length ?? 0}
                        </td>
                        <td className="px-4 py-3 text-sm text-brand-gray">
                          {format(new Date(entity.createdAt), 'PPP')}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(entity)}
                              disabled={editingId === entity.id}
                              className="inline-flex items-center gap-2 rounded-lg bg-brand-gray px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brand-orange"
                            >
                              {editingId === entity.id ? <Spinner /> : null}
                              {editingId === entity.id ? 'Saving…' : 'Edit'}
                            </button>
                            <button
                              onClick={() => handleDelete(entity.id)}
                              disabled={loadingId === entity.id}
                              className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500/50"
                            >
                              {loadingId === entity.id ? <Spinner /> : null}
                              {loadingId === entity.id ? 'Deleting…' : 'Delete'}
                            </button>
                          </div>
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
