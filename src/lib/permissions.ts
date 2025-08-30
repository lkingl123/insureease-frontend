// Map of route -> allowed roles
export const permissions: Record<string, Role[]> = {
  '/api/users': ['super_admin', 'entity_admin'],
  '/api/invite': ['super_admin', 'entity_admin'],
  '/api/entities': ['super_admin'],
  '/api/providers': ['super_admin', 'entity_admin', 'cred_specialist'],
  '/api/payers': ['super_admin', 'entity_admin', 'cred_specialist', 'provider'],
  '/api/dashboard-metrics': ['super_admin', 'entity_admin', 'cred_specialist'],
}
import { Role } from './auth'