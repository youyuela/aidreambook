import { type NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import type Stripe from 'stripe';
import { stripe, SUBSCRIPTION_PLANS } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    if (!stripe) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
    }

    let event: Stripe.Event;

    try {
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      if (!webhookSecret) {
        throw new Error('STRIPE_WEBHOOK_SECRET is not configured');
      }

      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    console.log(`Processing event: ${event.type}`);

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId;
  if (!stripe) return;

  if (!userId) {
    console.error('No userId in subscription metadata');
    return;
  }

  // 根据价格ID确定订阅等级
  const priceId = subscription.items.data[0]?.price.id;
  let tier: keyof typeof SUBSCRIPTION_PLANS = 'FREE';

  for (const [key, plan] of Object.entries(SUBSCRIPTION_PLANS)) {
    if (plan.priceId === priceId) {
      tier = key as keyof typeof SUBSCRIPTION_PLANS;
      break;
    }
  }

  // 更新用户订阅信息
  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionTier: tier,
      subscriptionStatus: subscription.status,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer as string,
      subscriptionEndDate: new Date((subscription as any).current_period_end * 1000),
      monthlyQuota: SUBSCRIPTION_PLANS[tier].quota === -1 ? 999999 : SUBSCRIPTION_PLANS[tier].quota,
      // 重置已使用配额（新计费周期开始）
      usedQuota: subscription.status === 'active' ? 0 : undefined,
      quotaResetDate: new Date((subscription as any).current_period_end * 1000),
    },
  });

  // 创建或更新订阅记录
  await prisma.subscription.upsert({
    where: {
      stripeSubscriptionId: subscription.id,
    },
    update: {
      status: subscription.status,
      currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      cancelAtPeriodEnd: (subscription as any).cancel_at_period_end,
    },
    create: {
      userId,
      tier,
      status: subscription.status,
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      stripeCustomerId: subscription.customer as string,
      currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      cancelAtPeriodEnd: (subscription as any).cancel_at_period_end,
    },
  });

  console.log(`Updated subscription for user ${userId} to ${tier}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId;
  if (!stripe) return;

  if (!userId) {
    console.error('No userId in subscription metadata');
    return;
  }

  // 将用户降级为免费版
  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionTier: 'FREE',
      subscriptionStatus: 'canceled',
      stripeSubscriptionId: null,
      subscriptionEndDate: null,
      monthlyQuota: SUBSCRIPTION_PLANS.FREE.quota,
      usedQuota: 0,
      quotaResetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  // 更新订阅记录状态
  await prisma.subscription.updateMany({
    where: {
      stripeSubscriptionId: subscription.id,
    },
    data: {
      status: 'canceled',
    },
  });

  console.log(`Canceled subscription for user ${userId}`);
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId = (invoice as any).subscription as string;

  if (!stripe) return;
  if (!subscriptionId) return;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const userId = subscription.metadata.userId;

  if (!userId) return;

  // 重置用户的月度配额
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { subscriptionTier: true },
  });

  if (user) {
    const tier = user.subscriptionTier;
    const quota = SUBSCRIPTION_PLANS[tier].quota === -1 ? 999999 : SUBSCRIPTION_PLANS[tier].quota;

    await prisma.user.update({
      where: { id: userId },
      data: {
        usedQuota: 0,
        monthlyQuota: quota,
        quotaResetDate: new Date((subscription as any).current_period_end * 1000),
      },
    });
  }

  console.log(`Payment succeeded for user ${userId}`);
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = (invoice as any).subscription as string;
  if (!stripe) return;

  if (!subscriptionId) return;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const userId = subscription.metadata.userId;

  if (!userId) return;

  // 可以在这里处理支付失败的逻辑，比如发送邮件通知
  console.log(`Payment failed for user ${userId}`);

  // 如果多次支付失败，可以考虑暂停服务或降级
  if (subscription.status === 'past_due') {
    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionStatus: 'past_due',
      },
    });
  }
}
