import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createCheckoutSession, createStripeCustomer } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { priceId, tier } = await request.json();

    if (!priceId || !tier) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 获取用户信息
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let customerId = user.stripeCustomerId;

    // 如果用户没有 Stripe 客户ID，创建一个
    if (!customerId) {
      const customer = await createStripeCustomer(user.email, user.name || undefined);
      customerId = customer.id;

      // 更新用户的 Stripe 客户ID
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    // 创建结账会话
    const checkoutSession = await createCheckoutSession(
      customerId,
      priceId,
      user.id,
      `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
      `${process.env.NEXTAUTH_URL}/pricing?canceled=true`
    );

    return NextResponse.json({ url: checkoutSession.url });

  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
