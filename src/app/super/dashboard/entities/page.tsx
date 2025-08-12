import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'

export default async function ManageEntitiesPage() {
  const entities = await prisma.entity.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <main className="container" style={{ paddingTop: '3rem' }}>
      <section className="row is-center">
        <div className="card" style={{ width: '100%', maxWidth: '700px' }}>
          <div className="card-body">
            <h1 className="is-large mb-2 has-text-centered">Manage Entities</h1>

            {entities.length === 0 ? (
              <p className="is-center">No entities found.</p>
            ) : (
              <table className="table is-full-width">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Slug</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {entities.map((entity: { id: string; name: string; slug: string; createdAt: Date }) => (
                    <tr key={entity.id}>
                      <td>{entity.name}</td>
                      <td>{entity.slug}</td>
                      <td>{format(new Date(entity.createdAt), 'PPP')}</td>
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
