"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Check, Crown, Zap, Brain, BookOpen, Image, Video,
  Users, Award, Sparkles, Star, Infinity as InfinityIcon, Shield,
  ArrowRight, Palette, Bot
} from "lucide-react";
import { SUBSCRIPTION_PLANS } from "@/lib/stripe";
import Link from "next/link";

export default function Pricing() {
  const { data: session } = useSession();
  const [isYearly, setIsYearly] = useState(false);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string, tier: string) => {
    if (!session) {
      // 重定向到登录页面
      window.location.href = '/auth/signin?callbackUrl=/pricing';
      return;
    }

    setIsLoading(tier);

    try {
      const response = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          tier,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create subscription');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('订阅失败，请重试');
    } finally {
      setIsLoading(null);
    }
  };

  const getYearlyPrice = (monthlyPrice: number) => {
    return monthlyPrice * 10; // 年付8.3折优惠
  };

  const plans = [
    {
      key: 'FREE',
      ...SUBSCRIPTION_PLANS.FREE,
      icon: Sparkles,
      color: 'from-gray-500 to-gray-600',
      popular: false,
    },
    {
      key: 'BASIC',
      ...SUBSCRIPTION_PLANS.BASIC,
      icon: Zap,
      color: 'from-blue-500 to-blue-600',
      popular: false,
    },
    {
      key: 'PRO',
      ...SUBSCRIPTION_PLANS.PRO,
      icon: Crown,
      color: 'from-purple-500 to-purple-600',
      popular: true,
    },
    {
      key: 'EXPERT',
      ...SUBSCRIPTION_PLANS.EXPERT,
      icon: Star,
      color: 'from-yellow-500 to-yellow-600',
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen dream-bg">
      {/* 导航栏 */}
      <nav className="border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 dream-gradient rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold dream-text-gradient">梦境之书</span>
          </Link>

          <div className="flex items-center space-x-4">
            {session ? (
              <Link href="/dashboard">
                <Button variant="ghost">
                  仪表板
                </Button>
              </Link>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/signin">
                  <Button variant="ghost">
                    登录
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="dream-gradient">
                    注册
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16">
        {/* 头部 */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            选择适合您的
            <span className="dream-text-gradient">创作计划</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            从免费体验到专业创作，我们为每个梦想家提供合适的AI创作工具
          </p>

          {/* 年付切换 */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-sm ${!isYearly ? 'text-white' : 'text-gray-400'}`}>月付</span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-purple-500"
            />
            <span className={`text-sm ${isYearly ? 'text-white' : 'text-gray-400'}`}>年付</span>
            <Badge className="bg-green-500 text-white">省17%</Badge>
          </div>
        </div>

        {/* 订阅计划 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const currentPrice = isYearly && plan.price > 0 ? getYearlyPrice(plan.price) : plan.price;
            const isCurrentPlan = session?.user?.subscriptionTier === plan.key;

            return (
              <Card
                key={plan.key}
                className={`relative glass-card hover:glow transition-all duration-300 ${
                  plan.popular ? 'border-purple-500 border-2' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-purple-500 text-white px-4 py-1">
                      🔥 最受欢迎
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <CardTitle className="text-2xl text-white">{plan.name}</CardTitle>
                  <CardDescription className="text-gray-400">{plan.description}</CardDescription>

                  <div className="text-center py-4">
                    {plan.price === 0 ? (
                      <div className="text-3xl font-bold text-white">免费</div>
                    ) : (
                      <div>
                        <div className="text-4xl font-bold text-white">
                          ¥{currentPrice}
                          <span className="text-lg text-gray-400 font-normal">
                            /{isYearly ? '年' : '月'}
                          </span>
                        </div>
                        {isYearly && (
                          <div className="text-sm text-gray-400 line-through">
                            ¥{plan.price * 12}/年
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* 配额显示 */}
                  <div className="text-center p-4 bg-black/20 rounded-lg">
                    {plan.quota === -1 ? (
                      <div className="flex items-center justify-center gap-2">
                        <InfinityIcon className="w-5 h-5 text-purple-400" />
                        <span className="text-white font-semibold">无限生成</span>
                      </div>
                    ) : (
                      <div>
                        <div className="text-2xl font-bold text-white">{plan.quota}</div>
                        <div className="text-sm text-gray-400">次/月</div>
                      </div>
                    )}
                  </div>

                  {/* 功能列表 */}
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* 订阅按钮 */}
                  <div className="pt-4">
                    {isCurrentPlan ? (
                      <Button disabled className="w-full" variant="outline">
                        当前计划
                      </Button>
                    ) : plan.key === 'FREE' ? (
                      <Link href="/auth/signup">
                        <Button className="w-full" variant="outline">
                          免费开始
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90 transition-opacity`}
                        onClick={() => plan.priceId && handleSubscribe(plan.priceId, plan.key)}
                        disabled={isLoading === plan.key}
                      >
                        {isLoading === plan.key ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            处理中...
                          </div>
                        ) : (
                          <>
                            立即升级
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* 功能对比表 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">详细功能对比</h2>

          <Card className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-white font-semibold">功能</th>
                    {plans.map(plan => (
                      <th key={plan.key} className="text-center p-4 text-white font-semibold min-w-32">
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {[
                    {
                      feature: 'AI梦境解析',
                      values: ['基础', '高级', '专业', '专家级']
                    },
                    {
                      feature: '小说生成',
                      values: ['标准', '高质量', '专业级', '大师级']
                    },
                    {
                      feature: '图片生成质量',
                      values: ['1024x1024', '1024x1024 HD', '4K高清', '8K超高清']
                    },
                    {
                      feature: '视频生成',
                      values: ['15秒标清', '15秒高清', '30秒高清', '60秒超高清']
                    },
                    {
                      feature: '批量处理',
                      values: [false, false, true, true]
                    },
                    {
                      feature: '自定义AI模型',
                      values: [false, false, true, true]
                    },
                    {
                      feature: 'API访问',
                      values: [false, false, false, true]
                    },
                    {
                      feature: '商业使用授权',
                      values: [false, false, true, true]
                    },
                    {
                      feature: '专属客服',
                      values: [false, '邮件支持', '优先支持', '一对一咨询']
                    },
                  ].map((row) => (
                    <tr key={row.feature} className="border-b border-white/5">
                      <td className="p-4 text-gray-300 font-medium">{row.feature}</td>
                      {row.values.map((value, valueIndex) => (
                        <td key={`${row.feature}-${valueIndex}`} className="p-4 text-center">
                          {typeof value === 'boolean' ? (
                            value ? (
                              <Check className="w-5 h-5 text-green-400 mx-auto" />
                            ) : (
                              <span className="text-gray-500">-</span>
                            )
                          ) : (
                            <span className="text-gray-300">{value}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">常见问题</h2>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                q: '可以随时取消订阅吗？',
                a: '是的，您可以随时取消订阅。取消后将在当前计费周期结束时停止续费，您仍可以使用剩余时间的服务。'
              },
              {
                q: '配额用完后会怎样？',
                a: '当月配额用完后，您需要等待下个月配额重置，或者升级到更高级的计划以获得更多配额。'
              },
              {
                q: '支持哪些支付方式？',
                a: '我们支持信用卡、借记卡、支付宝、微信支付等多种支付方式，通过安全的Stripe支付系统处理。'
              },
              {
                q: '生成的内容版权归谁？',
                a: '专业版和专家版用户拥有生成内容的完整商业使用权。免费版和基础版仅限个人非商业使用。'
              },
              {
                q: '如何成为认证专家？',
                a: '具有心理学、文学、艺术等相关专业背景的用户可以申请专家认证，通过审核后将获得专家徽章和特殊权限。'
              },
            ].map((item) => (
              <Card key={item.q} className="glass-card">
                <CardHeader>
                  <CardTitle className="text-white text-lg">{item.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">{item.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="glass-card max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                还在犹豫？先免费体验吧！
              </h3>
              <p className="text-gray-300 mb-6">
                注册即可获得免费配额，体验AI梦境创作的神奇之处
              </p>
              <Link href="/auth/signup">
                <Button size="lg" className="dream-gradient">
                  <Sparkles className="w-5 h-5 mr-2" />
                  免费开始创作
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
