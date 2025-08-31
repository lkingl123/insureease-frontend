// Map of route -> allowed roles
import { Role } from './auth'

export const permissions: Record<string, Role[]> = {
  '/api/users': ['super_admin', 'entity_admin'],
  '/api/invite': ['super_admin', 'entity_admin'],
  '/api/entities': ['super_admin'],
  '/api/providers': ['super_admin', 'entity_admin', 'cred_specialist'],
  '/api/payers': ['super_admin', 'entity_admin', 'cred_specialist'],
  '/api/payers/[id]/contacts': ['super_admin', 'entity_admin', 'cred_specialist'],
  '/api/payers/[id]/products': ['super_admin', 'entity_admin', 'cred_specialist'],
  '/api/dashboard-metrics': ['super_admin', 'entity_admin', 'cred_specialist'],
  '/api/me': ['super_admin', 'entity_admin', 'cred_specialist', 'provider'],
}
