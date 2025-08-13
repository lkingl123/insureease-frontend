import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'

export default async function ManageEntitiesPage() {
  const entities = await prisma.entity.findMany({
    orderBy: { createdAt: 'desc' },
    include: { users: true },
  })

  type EntityWithUsers = {
  id: string
  name: string
  slug: string
  createdAt: Date
  users: { id: string }[]
}

  return (
    <main className="container" style={{ paddingTop: '3rem' }}>
      <section className="row is-center">
        <div className="card" style={{ width: '100%', maxWidth: '900px' }}>
          <div className="card-body">
            <h1 className="is-large mb-4 has-text-centered">Manage Entities</h1>

            <form action="/api/entities" method="POST" className="mb-4 flex gap-2">
              <input name="name" placeholder="Entity Name" className="input" required />
              <input name="slug" placeholder="Slug (URL safe)" className="input" required />
              <button type="submit" className="button is-primary">Add</button>
            </form>

            {entities.length === 0 ? (
              <p className="has-text-centered">No entities found.</p>
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
                  {entities.map((entity: EntityWithUsers) => (
                    <tr key={entity.id}>
                      <td>{entity.name}</td>
                      <td>{entity.slug}</td>
                      <td>{entity.users.length}</td>
                      <td>{format(new Date(entity.createdAt), 'PPP')}</td>
                      <td>
                        <button className="button is-small is-warning">Edit</button>
                        <button className="button is-small is-danger">Delete</button>
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
