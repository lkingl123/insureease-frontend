export type InviteWithEntity = {
  id: string
  email: string
  role: 'entity_admin' | 'cred_specialist' | 'provider'
  entityId: string
  entity: {
    id: string
    name: string
    slug: string
  } | null
  used: boolean
  createdAt: string | Date
  token: string
}

export type EntityWithUsers = {
  id: string
  name: string
  slug: string
  createdAt: string | Date
  users: {
    id: string
    email: string
    role: string
    status: string
  }[]
}
