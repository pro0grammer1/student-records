import { auth } from '@/app/auth';
import { NextResponse } from 'next/server';
import { connectDB } from '@/db/connect';
import { User } from '@/db/authInfo';

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  const user = await User.findOne({ email: session.user.email });

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 404 });
  }

  return NextResponse.json({
    id: user._id.toString(),
    email: user.email,
  });
}
/*
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  await connectDB();

  await User.updateOne(
    { email: session.user.email },
    { $set: { name: body.name } }
  );

  return NextResponse.json({ success: true });
}
*/