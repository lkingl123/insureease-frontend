// src/app/[entity]/dashboard/page.tsx
import { RoleGuard } from '@/components/RoleGuard'

type Props = {
  params: { entity: string }
}

export default function EntityDashboard({ params }: Props) {
  const { entity } = params

  return (
    <RoleGuard required={['entity_admin', 'cred_specialist', 'provider']}>
      <main className="p-8">
        <h1 className="text-3xl font-bold">Dashboard for {entity}</h1>
      </main>
    </RoleGuard>
  )
}
