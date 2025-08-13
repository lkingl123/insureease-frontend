import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const invites = await prisma.inviteToken.findMany({
      include: { entity: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(invites)
  } catch (error) {
    console.error('❌ Failed to fetch invites:', error)
    return NextResponse.json({ error: 'Failed to fetch invites' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { token } = await req.json()

    if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 400 })

    const invite = await prisma.inviteToken.findUnique({ where: { token } })
    if (!invite) return NextResponse.json({ error: 'Invite not found' }, { status: 404 })

    await prisma.inviteToken.delete({ where: { token } })

    await prisma.user.deleteMany({
      where: { email: invite.email, status: 'pending' },
    })

    return NextResponse.json({ message: 'Invite and user deleted' })
  } catch (error) {
    console.error('❌ Failed to delete invite:', error)
    return NextResponse.json({ error: 'Failed to delete invite' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, role, entityId } = body

    if (!email || !role || !entityId)
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24)

    const invite = await prisma.inviteToken.create({
      data: { email, token, role, entityId, expiresAt },
      include: { entity: true },
    })

    await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        password: 'pending',
        status: 'pending',
        entityId,
        role,
      },
    })

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const inviteUrl = `${baseUrl}/accept-invite?token=${token}`

    const mailerSend = new MailerSend({
      apiKey: process.env.MAILERSEND_API_KEY!,
    })

    const emailParams = new EmailParams()
      .setFrom(new Sender(process.env.EMAIL_FROM!, 'InsureEase'))
      .setTo([new Recipient(email, '')])
      .setSubject('You’ve been invited to InsureEase')
      .setHtml(`
        <h2>Welcome to InsureEase</h2>
        <p>You’ve been invited as a <strong>${role.replace('_', ' ')}</strong> for the entity <strong>${invite.entity?.name || 'Unknown Entity'}</strong>.</p>
        <p><a href="${inviteUrl}">Click here to accept your invite</a></p>
        <p>This link expires in 24 hours.</p>
      `)

    await mailerSend.email.send(emailParams)

    return NextResponse.json({ message: 'Invite sent', invite, inviteUrl })

  } catch (error) {
    console.error('❌ Invite API failed:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
