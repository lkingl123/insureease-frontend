import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { token, name, password } = await req.json();

  if (!token || !name || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const invite = await prisma.inviteToken.findUnique({
    where: { token },
  });

  if (!invite || invite.used || invite.expiresAt < new Date()) {
    return NextResponse.json({ error: 'Invalid or expired invite' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: invite.email },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { email: invite.email },
    data: {
      name,
      password: hashedPassword,
      status: 'active',
    },
  });

    // Assign user to the entity with the role from the invite
  await prisma.userEntityRole.create({
    data: {
      userId: user.id,
      entityId: invite.entityId,
      role: invite.role,
    },
  });

  await prisma.inviteToken.update({
    where: { token },
    data: { used: true },
  });

  return NextResponse.json({ message: 'User activated successfully' });
}
