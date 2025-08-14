'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import BackButton from '@/components/BackButton'
import Spinner from '@/components/Spinner' // adjust path if needed

type Entity = {
  id: string
  name: string
  slug: string
  createdAt: string // coming from API as ISO string
  users?: { id: string }[] // may be undefined if API ever forgets include
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
    <main className="container pt-12">
      <BackButton />
      <section className="row is-center">
        <div className="card w-full max-w-4xl">
          <div className="card-body">
            <h1 className="is-large mb-4 text-center">Manage Entities</h1>

            {/* Create form keeps working via your existing POST /api/entities route */}
            <form
              action="/api/entities"
              method="POST"
              className="mb-4 flex items-center justify-center gap-2"
            >
              <input
                name="name"
                placeholder="Entity Name"
                className="input"
                required
              />
              <input
                name="slug"
                placeholder="Slug"
                className="input mt-6"
                required
              />
              <button type="submit" className="mt-6 button is-primary">
                Add
              </button>
            </form>


            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Spinner/>
              </div>
            ) : entities.length === 0 ? (
              <p className="text-center">No entities found.</p>
            ) : (
              <table className="table is-fullwidth is-hoverable">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Slug</th>
                    <th>Users</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {entities.map((entity) => (
                    <tr key={entity.id}>
                      <td>{entity.name}</td>
                      <td>{entity.slug}</td>
                      <td>{entity.users?.length ?? 0}</td>
                      <td>{format(new Date(entity.createdAt), 'PPP')}</td>
                      <td className="space-x-2">
                        <button
                          className="button is-small is-warning inline-flex items-center gap-1"
                          onClick={() => handleEdit(entity)}
                          disabled={editingId === entity.id}
                        >
                          {editingId === entity.id ? <Spinner/> : 'Edit'}
                        </button>
                        <button
                          className="button is-small is-danger inline-flex items-center gap-1"
                          onClick={() => handleDelete(entity.id)}
                          disabled={loadingId === entity.id}
                        >
                          {loadingId === entity.id ? <Spinner /> : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
