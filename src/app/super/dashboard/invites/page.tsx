import { prisma } from '@/lib/prisma'

export default async function InviteListPage() {
  const invites = await prisma.inviteToken.findMany({
    orderBy: { createdAt: 'desc' },
    include: { entity: true },
  })

  return (
    <main className="container" style={{ paddingTop: '3rem' }}>
      <h1 className="is-large mb-4">Pending Invites</h1>
      {invites.length === 0 ? (
        <p>No pending invites.</p>
      ) : (
        <table className="table is-fullwidth">
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Entity</th>
              <th>Status</th>
              <th>Sent</th>
            </tr>
          </thead>
          <tbody>
            {invites.map((invite: {
            id: string
            email: string
            role: string
            used: boolean
            createdAt: string | Date
            entity?: { name: string }
            }) => (
            <tr key={invite.id}>
                <td>{invite.email}</td>
                <td>{invite.role}</td>
                <td>{invite.entity?.name}</td>
                <td>{invite.used ? 'Used' : 'Pending'}</td>
                <td>{new Date(invite.createdAt).toLocaleDateString()}</td>
            </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  )
}
