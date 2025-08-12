import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { Resend } from 'resend';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const body = await req.json();
  const { email, role, entityId } = body;

  if (!email || !role || !entityId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours

  // Create invite token
  const invite = await prisma.inviteToken.create({
    data: {
      email,
      token,
      role,
      entityId,
      expiresAt,
    },
  });

  // Create placeholder user
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: 'pending', 
      status: 'pending',
    },
  });


  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const inviteUrl = `${baseUrl}/accept-invite?token=${token}`;

  // Send invite email
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: process.env.EMAIL_FROM || 'InsureEase <onboarding@resend.dev>',
    to: email,
    subject: 'You’ve been invited to InsureEase',
    html: `
      <h2>Welcome to InsureEase</h2>
      <p>You’ve been invited as a <strong>${role}</strong>.</p>
      <p><a href="${inviteUrl}">Click here to accept your invite</a></p>
      <p>This link expires in 24 hours.</p>
    `,
  });

  return NextResponse.json({ message: 'Invite sent', inviteUrl });
}
