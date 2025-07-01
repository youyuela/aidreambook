"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Star, Award, Brain, BookOpen, Palette, Users,
  CheckCircle, Clock, AlertCircle, Crown
} from "lucide-react";
import Link from "next/link";

export default function ExpertApply() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    reason: '',
    credentials: '',
    portfolio: '',
    experience: '',
    specialization: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      alert('请先登录');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/expert/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          reason: '',
          credentials: '',
          portfolio: '',
          experience: '',
          specialization: '',
        });
      } else {
        throw new Error('Application failed');
      }
    } catch (error) {
      console.error('Expert application error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!session) {
    return (
      <div className="min-h-screen dream-bg flex items-center justify-center">
        <Card className="glass-card max-w-md">
          <CardHeader>
            <CardTitle className="text-white text-center">需要登录</CardTitle>
            <CardDescription className="text-gray-400 text-center">
              申请专家认证需要先登录您的账户
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/auth/signin?callbackUrl=/expert/apply">
              <Button className="w-full dream-gradient">
                前往登录
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (session.user.isExpert) {
    return (
      <div className="min-h-screen dream-bg">
        <div className="container mx-auto px-4 py-16">
          <Card className="glass-card max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-white">您已是认证专家</CardTitle>
              <CardDescription className="text-gray-400">
                恭喜！您已经通过了专家认证，享受专家特权吧
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/dashboard">
                <Button className="dream-gradient">
                  前往仪表板
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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

          <Link href="/dashboard">
            <Button variant="ghost">
              返回仪表板
            </Button>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* 头部 */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
              <Star className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">申请专家认证</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              加入我们的专家团队，获得特殊权限和认证徽章，帮助更多用户探索梦境世界
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* 专家权益 */}
            <div className="lg:col-span-1">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Award className="w-5 h-5" />
                    专家权益
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Crown className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-white">专家徽章</h4>
                      <p className="text-sm text-gray-400">获得醒目的专家认证标识</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Brain className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-white">专业解析</h4>
                      <p className="text-sm text-gray-400">提供专业的梦境解析服务</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-white">社区影响力</h4>
                      <p className="text-sm text-gray-400">成为社区的意见领袖</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-white">内容审核</h4>
                      <p className="text-sm text-gray-400">参与社区内容质量管理</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Palette className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-white">创作指导</h4>
                      <p className="text-sm text-gray-400">指导新用户的创作技巧</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 申请要求 */}
              <Card className="glass-card mt-6">
                <CardHeader>
                  <CardTitle className="text-white">申请要求</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>心理学、文学、艺术等相关专业背景</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>具有梦境分析或创作经验</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>能够提供专业的见解和指导</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>遵守社区规范和职业道德</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 申请表单 */}
            <div className="lg:col-span-2">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-white">专家认证申请</CardTitle>
                  <CardDescription className="text-gray-400">
                    请详细填写以下信息，我们将在3-5个工作日内处理您的申请
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {submitStatus === 'success' && (
                    <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                      <div className="flex items-center gap-2 text-green-400">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-semibold">申请已提交</span>
                      </div>
                      <p className="text-sm text-green-300 mt-1">
                        我们将在3-5个工作日内审核您的申请，请留意邮件通知
                      </p>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                      <div className="flex items-center gap-2 text-red-400">
                        <AlertCircle className="w-5 h-5" />
                        <span className="font-semibold">申请失败</span>
                      </div>
                      <p className="text-sm text-red-300 mt-1">
                        提交申请时出现错误，请稍后重试
                      </p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="specialization" className="text-white">专业领域</Label>
                      <Input
                        id="specialization"
                        placeholder="例如：心理学、文学创作、艺术治疗等"
                        value={formData.specialization}
                        onChange={(e) => handleInputChange('specialization', e.target.value)}
                        className="mt-1 bg-black/20 border-white/10 text-white"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="reason" className="text-white">申请理由</Label>
                      <Textarea
                        id="reason"
                        placeholder="请说明您申请专家认证的原因和动机"
                        value={formData.reason}
                        onChange={(e) => handleInputChange('reason', e.target.value)}
                        className="mt-1 bg-black/20 border-white/10 text-white min-h-24"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="credentials" className="text-white">专业资质</Label>
                      <Textarea
                        id="credentials"
                        placeholder="请详细描述您的教育背景、专业证书、工作经历等"
                        value={formData.credentials}
                        onChange={(e) => handleInputChange('credentials', e.target.value)}
                        className="mt-1 bg-black/20 border-white/10 text-white min-h-32"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="experience" className="text-white">相关经验</Label>
                      <Textarea
                        id="experience"
                        placeholder="请描述您在梦境分析、心理咨询或相关领域的实践经验"
                        value={formData.experience}
                        onChange={(e) => handleInputChange('experience', e.target.value)}
                        className="mt-1 bg-black/20 border-white/10 text-white min-h-32"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="portfolio" className="text-white">作品集或案例</Label>
                      <Textarea
                        id="portfolio"
                        placeholder="请提供您的代表性作品、研究成果或案例分析（可包含链接）"
                        value={formData.portfolio}
                        onChange={(e) => handleInputChange('portfolio', e.target.value)}
                        className="mt-1 bg-black/20 border-white/10 text-white min-h-32"
                      />
                    </div>

                    <div className="pt-4">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full dream-gradient"
                        size="lg"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            提交申请中...
                          </div>
                        ) : (
                          <>
                            <Star className="w-4 h-4 mr-2" />
                            提交专家申请
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
