import { getUserFromToken } from './auth'
import { permissions } from './permissions'
import { NextResponse } from 'next/server'

export async function authorize(req: Request) {
  const user = await getUserFromToken()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = new URL(req.url)
  const path = url.pathname.split('?')[0] // ignore query params

  const allowedRoles = permissions[path] ?? []
  if (!allowedRoles.includes(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return user
}
