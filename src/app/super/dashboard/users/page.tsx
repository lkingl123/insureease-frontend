import { prisma } from '@/lib/prisma'

export default async function AllUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: { entity: true },
  })

  return (
    <main className="container" style={{ paddingTop: '3rem' }}>
      <h1 className="is-large mb-4">All Users</h1>
      {users.length === 0 ? (
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
            </tr>
          </thead>
          <tbody>
            {users.map((user: {
                id: string
                email: string
                role: string
                status: string
                createdAt: string | Date
                entity?: { name: string }
                }) => (
                <tr key={user.id}>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.status}</td>
                    <td>{user.entity?.name ?? '—'}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
                ))}
          </tbody>
        </table>
      )}
    </main>
  )
}
