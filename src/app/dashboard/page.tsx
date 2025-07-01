"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Crown, Brain, BookOpen, Image, Video, Calendar,
  Settings, Star, Zap, TrendingUp, Users, Award,
  Plus, Clock, Heart, Share2, Download, Eye
} from "lucide-react";
import Link from "next/link";

interface QuotaStatus {
  unlimited: boolean;
  used: number;
  remaining: number;
  quota?: number;
  percentage: number;
}

interface Dream {
  id: string;
  title: string;
  content: string;
  status: string;
  createdAt: string;
  isPublic: boolean;
  views: number;
  likes: number;
  imageUrl?: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [quotaStatus, setQuotaStatus] = useState<QuotaStatus | null>(null);
  const [recentDreams, setRecentDreams] = useState<Dream[]>([]);
  const [stats, setStats] = useState({
    totalDreams: 0,
    totalViews: 0,
    totalLikes: 0,
    expertLevel: 1,
  });

  useEffect(() => {
    if (session?.user?.id) {
      fetchDashboardData();
    }
  }, [session]);

  const fetchDashboardData = async () => {
    try {
      // 获取配额状态
      const quotaResponse = await fetch('/api/user/quota');
      if (quotaResponse.ok) {
        setQuotaStatus(await quotaResponse.json());
      }

      // 获取最近的梦境
      const dreamsResponse = await fetch('/api/user/dreams?limit=6');
      if (dreamsResponse.ok) {
        setRecentDreams(await dreamsResponse.json());
      }

      // 获取统计数据
      const statsResponse = await fetch('/api/user/stats');
      if (statsResponse.ok) {
        setStats(await statsResponse.json());
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen dream-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-4" />
          <p className="text-white">加载中...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen dream-bg flex items-center justify-center">
        <Card className="glass-card max-w-md">
          <CardHeader>
            <CardTitle className="text-white text-center">请先登录</CardTitle>
            <CardDescription className="text-gray-400 text-center">
              您需要登录才能访问仪表板
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/auth/signin">
              <Button className="w-full dream-gradient">
                前往登录
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const user = session.user;
  const subscriptionBadgeColor = {
    FREE: "bg-gray-500",
    BASIC: "bg-blue-500",
    PRO: "bg-purple-500",
    EXPERT: "bg-gold-500"
  };

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
            <Badge className={`${subscriptionBadgeColor[user.subscriptionTier || 'FREE']} text-white`}>
              {user.isExpert && <Crown className="w-3 h-3 mr-1" />}
              {user.subscriptionTier || 'FREE'}
            </Badge>
            <Link href="/settings">
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* 欢迎区域 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                欢迎回来，{user.name || user.email}
                {user.isExpert && <Star className="inline w-6 h-6 text-yellow-400 ml-2" />}
              </h1>
              <p className="text-gray-400">
                今天又有什么有趣的梦境想要探索吗？
              </p>
            </div>
            <Link href="/">
              <Button className="dream-gradient">
                <Plus className="w-4 h-4 mr-2" />
                创建新梦境
              </Button>
            </Link>
          </div>
        </div>

        {/* 配额状态卡片 */}
        {quotaStatus && (
          <Card className="glass-card mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Zap className="w-5 h-5" />
                使用配额
              </CardTitle>
            </CardHeader>
            <CardContent>
              {quotaStatus.unlimited ? (
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">∞</div>
                  <p className="text-gray-300">无限制使用</p>
                  <p className="text-sm text-gray-500">本月已使用 {quotaStatus.used} 次</p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300">
                      已使用 {quotaStatus.used} / {quotaStatus.quota} 次
                    </span>
                    <span className="text-sm text-gray-500">
                      剩余 {quotaStatus.remaining} 次
                    </span>
                  </div>
                  <Progress
                    value={quotaStatus.percentage}
                    className="h-2 bg-black/20"
                  />
                  {quotaStatus.percentage > 80 && (
                    <div className="mt-4 text-center">
                      <Link href="/pricing">
                        <Button size="sm" className="dream-gradient">
                          <Crown className="w-3 h-3 mr-1" />
                          升级订阅
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* 统计概览 */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card">
            <CardContent className="p-6 text-center">
              <BookOpen className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats.totalDreams}</div>
              <p className="text-sm text-gray-400">创作梦境</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6 text-center">
              <Eye className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats.totalViews}</div>
              <p className="text-sm text-gray-400">总浏览量</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6 text-center">
              <Heart className="w-8 h-8 text-pink-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats.totalLikes}</div>
              <p className="text-sm text-gray-400">获得点赞</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6 text-center">
              <Award className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">Lv.{stats.expertLevel}</div>
              <p className="text-sm text-gray-400">创作等级</p>
            </CardContent>
          </Card>
        </div>

        {/* 主要内容区域 */}
        <Tabs defaultValue="dreams" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-black/20">
            <TabsTrigger value="dreams" className="data-[state=active]:bg-purple-500">
              我的梦境
            </TabsTrigger>
            <TabsTrigger value="collections" className="data-[state=active]:bg-purple-500">
              收藏夹
            </TabsTrigger>
            <TabsTrigger value="journal" className="data-[state=active]:bg-purple-500">
              梦境日记
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-500">
              数据分析
            </TabsTrigger>
          </TabsList>

          {/* 我的梦境 */}
          <TabsContent value="dreams">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentDreams.map((dream) => (
                <Card key={dream.id} className="glass-card hover:glow transition-all duration-300 group">
                  {dream.imageUrl && (
                    <div className="h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={dream.imageUrl}
                        alt={dream.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-white text-lg">{dream.title}</CardTitle>
                    <CardDescription className="text-gray-400">
                      {dream.content.substring(0, 100)}...
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(dream.createdAt).toLocaleDateString('zh-CN')}
                      </span>
                      <Badge
                        variant={dream.status === 'COMPLETED' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {dream.status === 'COMPLETED' ? '已完成' : '生成中'}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                      <span className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {dream.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {dream.likes}
                        </span>
                      </span>
                      {dream.isPublic && (
                        <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                          公开
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" className="flex-1 text-xs">
                        <Eye className="w-3 h-3 mr-1" />
                        查看
                      </Button>
                      <Button size="sm" variant="ghost" className="text-xs">
                        <Share2 className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-xs">
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {recentDreams.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">还没有梦境作品</h3>
                  <p className="text-gray-400 mb-6">开始您的第一个梦境创作之旅吧！</p>
                  <Link href="/">
                    <Button className="dream-gradient">
                      <Plus className="w-4 h-4 mr-2" />
                      创建梦境
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </TabsContent>

          {/* 收藏夹 */}
          <TabsContent value="collections">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white">我的收藏</CardTitle>
                <CardDescription className="text-gray-400">
                  管理您收藏的梦境作品
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">收藏夹为空</h3>
                  <p className="text-gray-400">浏览社区作品并收藏您喜欢的内容</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 梦境日记 */}
          <TabsContent value="journal">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Calendar className="w-5 h-5" />
                  梦境日记
                </CardTitle>
                <CardDescription className="text-gray-400">
                  记录您的梦境模式和趋势
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">开始记录梦境日记</h3>
                  <p className="text-gray-400 mb-6">跟踪您的梦境模式，发现潜在的心理趋势</p>
                  <Button className="dream-gradient">
                    <Plus className="w-4 h-4 mr-2" />
                    添加日记
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 数据分析 */}
          <TabsContent value="analytics">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <TrendingUp className="w-5 h-5" />
                    创作趋势
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <TrendingUp className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">暂无足够数据生成趋势分析</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Users className="w-5 h-5" />
                    受众分析
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">发布作品后可查看受众数据</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
