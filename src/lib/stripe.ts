import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});

// 订阅计划配置
export const SUBSCRIPTION_PLANS = {
  FREE: {
    name: '免费版',
    description: '基础功能，每月10次生成',
    price: 0,
    priceId: null,
    features: [
      '每月10次AI生成',
      '基础梦境解析',
      '标准图片生成',
      '社区作品浏览',
    ],
    quota: 10,
  },
  BASIC: {
    name: '基础版',
    description: '适合个人用户，每月100次生成',
    price: 9.99,
    priceId: process.env.STRIPE_BASIC_PRICE_ID,
    features: [
      '每月100次AI生成',
      '高级梦境解析',
      '高清图片生成',
      '视频生成功能',
      '无限收藏',
      '优先客服支持',
    ],
    quota: 100,
  },
  PRO: {
    name: '专业版',
    description: '适合创作者，每月500次生成',
    price: 29.99,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    features: [
      '每月500次AI生成',
      '专业梦境解析',
      '4K高清图片生成',
      '高质量视频生成',
      '批量处理功能',
      '自定义AI模型',
      '商业使用授权',
      '专属客服支持',
    ],
    quota: 500,
  },
  EXPERT: {
    name: '专家版',
    description: '无限生成，专家级功能',
    price: 99.99,
    priceId: process.env.STRIPE_EXPERT_PRICE_ID,
    features: [
      '无限AI生成',
      '专家级梦境解析',
      '8K超高清图片',
      '专业级视频生成',
      'API访问权限',
      '白标定制服务',
      '优先新功能体验',
      '一对一专家咨询',
    ],
    quota: -1, // -1 表示无限
  },
} as const;

export type SubscriptionTier = keyof typeof SUBSCRIPTION_PLANS;

// 创建 Stripe 客户
export async function createStripeCustomer(email: string, name?: string) {
  const customer = await stripe.customers.create({
    email,
    name,
    metadata: {
      source: 'dreambook_app',
    },
  });
  return customer;
}

// 创建订阅
export async function createSubscription(
  customerId: string,
  priceId: string,
  userId: string
) {
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    payment_settings: { save_default_payment_method: 'on_subscription' },
    expand: ['latest_invoice.payment_intent'],
    metadata: {
      userId,
    },
  });

  return subscription;
}

// 创建计费门户会话
export async function createBillingPortalSession(customerId: string, returnUrl: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
  return session;
}

// 创建结账会话
export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  userId: string,
  successUrl: string,
  cancelUrl: string
) {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    billing_address_collection: 'auto',
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
    },
  });

  return session;
}

// 取消订阅
export async function cancelSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
  return subscription;
}

// 立即取消订阅
export async function cancelSubscriptionImmediately(subscriptionId: string) {
  const subscription = await stripe.subscriptions.cancel(subscriptionId);
  return subscription;
}

// 恢复订阅
export async function resumeSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  });
  return subscription;
}

// 获取用户的使用统计
export function getUsageStats(tier: SubscriptionTier, usedQuota: number) {
  const plan = SUBSCRIPTION_PLANS[tier];
  const quota = plan.quota;

  if (quota === -1) {
    return {
      unlimited: true,
      used: usedQuota,
      remaining: -1,
      percentage: 0,
    };
  }

  const remaining = Math.max(0, quota - usedQuota);
  const percentage = quota > 0 ? (usedQuota / quota) * 100 : 0;

  return {
    unlimited: false,
    used: usedQuota,
    remaining,
    quota,
    percentage: Math.min(100, percentage),
  };
}

// 检查用户是否可以使用功能
export function canUseFeature(tier: SubscriptionTier, usedQuota: number): boolean {
  const plan = SUBSCRIPTION_PLANS[tier];

  // 专家版无限使用
  if (plan.quota === -1) return true;

  // 其他版本检查配额
  return usedQuota < plan.quota;
}

// 获取推荐的升级计划
export function getRecommendedUpgrade(tier: SubscriptionTier): SubscriptionTier | null {
  switch (tier) {
    case 'FREE':
      return 'BASIC';
    case 'BASIC':
      return 'PRO';
    case 'PRO':
      return 'EXPERT';
    case 'EXPERT':
      return null;
    default:
      return 'BASIC';
  }
}
