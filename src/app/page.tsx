"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import {
  Moon, Sun, Globe, LogIn, UserPlus, Sparkles, Brain,
  BookOpen, Image, Video, Share2, Heart, Eye, Clock,
  Wand2, Stars, Zap, ArrowRight, Play, Download,
  FileText, ImageIcon, VideoIcon, RotateCcw, User, Crown,
  Settings, LogOut
} from "lucide-react";
import {
  analyzeDream,
  generateNovel,
  generateImage,
  generateVideo,
  type DreamInput,
  type GenerationResult
} from "@/lib/ai-generator";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();
  const [dreamText, setDreamText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentLanguage, setCurrentLanguage] = useState("zh");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [generationResult, setGenerationResult] = useState<Partial<GenerationResult> | null>(null);
  const [currentStep, setCurrentStep] = useState<string>("");

  const handleGenerate = async () => {
    if (!dreamText.trim()) return;

    // 检查用户登录状态
    if (!session) {
      signIn();
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    setGenerationResult(null);

    try {
      // 检查配额
      setCurrentStep("检查使用配额...");
      const quotaResponse = await fetch('/api/user/quota');
      if (quotaResponse.ok) {
        const quotaStatus = await quotaResponse.json();
        if (!quotaStatus.unlimited && quotaStatus.remaining <= 0) {
          setCurrentStep("配额已用完，请升级订阅");
          return;
        }
      }

      // 首先创建梦境记录
      setCurrentStep("创建梦境记录...");
      const createResponse = await fetch('/api/user/dreams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: dreamText.substring(0, 50) + (dreamText.length > 50 ? '...' : ''),
          content: dreamText,
          mood: 'mysterious',
          style: 'surreal',
          isPublic: false,
        }),
      });

      if (!createResponse.ok) {
        const error = await createResponse.json();
        if (error.error.includes('Quota exceeded')) {
          setCurrentStep("配额已用完，请升级订阅");
          return;
        }
        throw new Error(error.error || 'Failed to create dream');
      }

      const dreamRecord = await createResponse.json();
      setGenerationProgress(10);

      // 开始AI生成流程
      const dreamInput: DreamInput = {
        content: dreamText,
        mood: 'mysterious',
        style: 'surreal',
        language: currentLanguage as 'zh' | 'en'
      };

      // 步骤1: 分析梦境
      setCurrentStep("正在分析梦境内容...");
      setGenerationProgress(25);
      const analysis = await analyzeDream(dreamInput);
      setGenerationProgress(40);

      // 步骤2: 生成小说
      setCurrentStep("正在创作梦境小说...");
      const novel = await generateNovel(dreamInput, analysis);
      setGenerationProgress(60);

      // 步骤3: 生成图片
      setCurrentStep("正在绘制梦境图像...");
      const image = await generateImage(dreamInput);
      setGenerationProgress(80);

      // 步骤4: 生成视频
      setCurrentStep("正在制作梦境视频...");
      const video = await generateVideo(dreamInput);
      setGenerationProgress(100);

      const result: Partial<GenerationResult> = {
        id: dreamRecord.id,
        dreamInput,
        analysis,
        novel,
        image,
        video,
        createdAt: new Date(),
        status: 'completed',
        progress: 100
      };

      setGenerationResult(result);
      setCurrentStep("创作完成！");

    } catch (error) {
      console.error('Generation failed:', error);
      if (error instanceof Error && error.message.includes('Quota exceeded')) {
        setCurrentStep("配额已用完，请升级订阅");
      } else {
        setCurrentStep("创作失败，请重试");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const features = [
    {
      icon: Brain,
      title: "智能梦境解析",
      description: "AI深度分析梦境内容，揭示潜意识信息",
      color: "text-purple-400"
    },
    {
      icon: BookOpen,
      title: "梦境小说生成",
      description: "基于梦境创作1000字精彩小说",
      color: "text-blue-400"
    },
    {
      icon: Image,
      title: "梦境图像创作",
      description: "将梦境转化为视觉艺术作品",
      color: "text-pink-400"
    },
    {
      icon: Video,
      title: "梦境视频制作",
      description: "生成15秒梦境动态视频",
      color: "text-green-400"
    }
  ];

  const showcaseItems = [
    {
      title: "星空下的奇遇",
      author: "dreamUser001",
      type: "novel",
      likes: 234,
      views: 1567,
      image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=300&h=200&fit=crop"
    },
    {
      title: "神秘森林",
      author: "moonDreamer",
      type: "image",
      likes: 456,
      views: 2890,
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop"
    },
    {
      title: "时空旅行",
      author: "starGazer",
      type: "video",
      likes: 789,
      views: 4523,
      image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=300&h=200&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 dream-gradient rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold dream-text-gradient">梦境之书</span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Sun className="w-4 h-4" />
            <Switch
              checked={isDarkMode}
              onCheckedChange={setIsDarkMode}
              className="data-[state=checked]:bg-primary"
            />
            <Moon className="w-4 h-4" />
          </div>

          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentLanguage(currentLanguage === "zh" ? "en" : "zh")}
            >
              {currentLanguage === "zh" ? "EN" : "中文"}
            </Button>
          </div>

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={session.user.image || ''} />
                    <AvatarFallback>
                      {session.user.name?.[0] || session.user.email?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex items-center">
                    <span className="text-sm text-white">{session.user.name || session.user.email}</span>
                    {session.user.isExpert && <Crown className="w-4 h-4 ml-1 text-yellow-400" />}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-black/90 border-white/10">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center cursor-pointer">
                    <User className="w-4 h-4 mr-2" />
                    仪表板
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/pricing" className="flex items-center cursor-pointer">
                    <Crown className="w-4 h-4 mr-2" />
                    升级订阅
                  </Link>
                </DropdownMenuItem>
                {!session.user.isExpert && (
                  <DropdownMenuItem asChild>
                    <Link href="/expert/apply" className="flex items-center cursor-pointer">
                      <Stars className="w-4 h-4 mr-2" />
                      申请专家认证
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" />
                    设置
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="flex items-center cursor-pointer text-red-400"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => signIn()}
              >
                <LogIn className="w-4 h-4 mr-2" />
                登录
              </Button>

              <Button
                size="sm"
                className="dream-gradient"
                onClick={() => signIn()}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                注册
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="floating mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="dream-text-gradient">探索</span>
              <br />
              <span className="text-white">您的梦境世界</span>
            </h1>
          </div>

          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            使用最先进的AI技术，将您的梦境转化为精彩的小说、艺术图片和动态视频。
            让每一个梦境都成为独特的创作灵感。
          </p>

          {/* Dream Input Form */}
          <Card className="glass-card max-w-2xl mx-auto mb-16">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2 text-white">
                <Wand2 className="w-5 h-5" />
                描述您的梦境
              </CardTitle>
              <CardDescription className="text-gray-400">
                详细描述您梦境中的场景、人物、情感和故事
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="昨晚我梦见了一片星空下的海洋，海面上漂浮着发光的水母，我驾驶着一艘透明的船只在其中穿梭..."
                value={dreamText}
                onChange={(e) => setDreamText(e.target.value)}
                className="min-h-32 bg-black/20 border-white/10 text-white placeholder:text-gray-500"
                maxLength={1000}
              />

              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>{dreamText.length}/1000 字符</span>
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                  <Stars className="w-3 h-3 mr-1" />
                  AI 就绪
                </Badge>
              </div>

              {isGenerating && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-purple-300">{currentStep || "AI 正在创作中..."}</span>
                    <span className="text-gray-400">{generationProgress}%</span>
                  </div>
                  <Progress value={generationProgress} className="h-2 bg-black/20" />
                </div>
              )}

              <Button
                onClick={handleGenerate}
                disabled={!dreamText.trim() || isGenerating}
                className="w-full dream-gradient hover:opacity-90 transition-opacity"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Zap className="w-4 h-4 mr-2 animate-pulse" />
                    创作中...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    开始AI创作
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Generation Results */}
          {generationResult && (
            <div className="max-w-6xl mx-auto mb-16 space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-4">✨ 您的梦境创作</h2>
                <p className="text-gray-400">AI已经为您的梦境创作了精彩的内容</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Dream Analysis */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Brain className="w-5 h-5 text-purple-400" />
                      梦境解析
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-purple-300 mb-2">主要符号</h4>
                      <div className="flex flex-wrap gap-2">
                        {generationResult.analysis?.symbols.map((symbol, idx) => (
                          <Badge key={`symbol-${symbol.symbol}-${idx}`} variant="secondary" className="bg-purple-500/20 text-purple-300">
                            {symbol.symbol}: {symbol.meaning}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-300 mb-2">情感色彩</h4>
                      <div className="space-y-1">
                        {generationResult.analysis?.emotions.map((emotion, idx) => (
                          <div key={`emotion-${emotion.emotion}-${idx}`} className="flex items-center justify-between">
                            <span className="text-gray-300">{emotion.emotion}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-2 bg-black/30 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blue-400 rounded-full transition-all"
                                  style={{ width: `${emotion.intensity}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-400">{emotion.intensity}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-300 mb-2">解析总结</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {generationResult.analysis?.interpretation}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Generated Novel */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <BookOpen className="w-5 h-5 text-blue-400" />
                      梦境小说
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      {generationResult.novel?.wordCount} 字 · {generationResult.novel?.genre}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-blue-300 mb-4">
                        {generationResult.novel?.title}
                      </h3>
                    </div>
                    <div className="max-h-48 overflow-y-auto scrollbar-thin">
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {generationResult.novel?.content.substring(0, 500)}
                        {(generationResult.novel?.content.length || 0) > 500 && "..."}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-blue-500 text-blue-300">
                        <FileText className="w-3 h-3 mr-1" />
                        阅读全文
                      </Button>
                      <Button size="sm" variant="outline" className="border-blue-500 text-blue-300">
                        <Download className="w-3 h-3 mr-1" />
                        下载
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Generated Image */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <ImageIcon className="w-5 h-5 text-pink-400" />
                      梦境图像
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      {generationResult.image?.dimensions.width} × {generationResult.image?.dimensions.height} · {generationResult.image?.style}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative group">
                      <img
                        src={generationResult.image?.url}
                        alt="Generated dream image"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <Button size="sm" className="bg-white/20 hover:bg-white/30">
                          <Eye className="w-3 h-3 mr-1" />
                          查看大图
                        </Button>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-pink-500 text-pink-300">
                        <Download className="w-3 h-3 mr-1" />
                        下载
                      </Button>
                      <Button size="sm" variant="outline" className="border-pink-500 text-pink-300">
                        <Share2 className="w-3 h-3 mr-1" />
                        分享
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Generated Video */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <VideoIcon className="w-5 h-5 text-green-400" />
                      梦境视频
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      {generationResult.video?.duration}秒 · {generationResult.video?.dimensions.width}×{generationResult.video?.dimensions.height}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative group">
                      <img
                        src={generationResult.video?.thumbnailUrl}
                        alt="Video thumbnail"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                        <Button size="lg" className="bg-white/20 hover:bg-white/30 rounded-full w-16 h-16">
                          <Play className="w-6 h-6 ml-1" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-green-500 text-green-300">
                        <Download className="w-3 h-3 mr-1" />
                        下载
                      </Button>
                      <Button size="sm" variant="outline" className="border-green-500 text-green-300">
                        <Share2 className="w-3 h-3 mr-1" />
                        分享
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="text-center space-y-4">
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={() => setGenerationResult(null)}
                    variant="outline"
                    className="border-purple-500 text-purple-300"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    重新创作
                  </Button>
                  <Button className="dream-gradient">
                    <Heart className="w-4 h-4 mr-2" />
                    保存到我的收藏
                  </Button>
                </div>
                <p className="text-sm text-gray-400">
                  作品将自动保存到您的账户中，您可以随时编辑和分享
                </p>
              </div>
            </div>
          )}

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => (
              <Card key={`feature-${feature.title}`} className="glass-card hover:glow transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 mx-auto mb-4 ${feature.color} bg-current/10 rounded-full flex items-center justify-center`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">创作流程</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            简单三步，让AI将您的梦境转化为精彩的多媒体内容
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "描述梦境", desc: "详细描述您梦境中的场景和故事", icon: Brain },
              { step: "02", title: "AI 创作", desc: "AI 分析并生成小说、图片和视频", icon: Wand2 },
              { step: "03", title: "分享作品", desc: "编辑完善后分享到社交平台", icon: Share2 }
            ].map((item, index) => (
              <div key={`step-${item.step}`} className="text-center relative">
                <div className="glass-card p-8 rounded-xl">
                  <div className="w-16 h-16 mx-auto mb-4 dream-gradient rounded-full flex items-center justify-center">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-purple-300 mb-2">{item.step}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
                {index < 2 && (
                  <ArrowRight className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 w-8 h-8 text-purple-400" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Showcase */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">梦境展示广场</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            探索其他用户创作的精彩梦境作品，获得创作灵感
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {showcaseItems.map((item, index) => (
            <Card key={`showcase-${item.title}-${item.author}`} className="glass-card hover:glow transition-all duration-300 overflow-hidden group">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <Badge className="absolute top-3 right-3 bg-black/50 text-white">
                  {item.type === "novel" && <BookOpen className="w-3 h-3 mr-1" />}
                  {item.type === "image" && <Image className="w-3 h-3 mr-1" />}
                  {item.type === "video" && <Video className="w-3 h-3 mr-1" />}
                  {item.type === "novel" ? "小说" : item.type === "image" ? "图片" : "视频"}
                </Badge>
                {item.type === "video" && (
                  <Button size="sm" className="absolute bottom-3 right-3 bg-black/50 hover:bg-black/70">
                    <Play className="w-3 h-3" />
                  </Button>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                  <span>by {item.author}</span>
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {item.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {item.views}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" className="flex-1 text-xs">
                    <Eye className="w-3 h-3 mr-1" />
                    查看
                  </Button>
                  <Button size="sm" variant="ghost" className="text-xs">
                    <Heart className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-xs">
                    <Share2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button variant="outline" size="lg" className="border-purple-500 text-purple-300 hover:bg-purple-500/10">
            查看更多作品
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-white/10">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 dream-gradient rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold dream-text-gradient">梦境之书</span>
            </div>
            <p className="text-gray-400 text-sm">
              探索梦境的无限可能，用AI技术记录和创造您的潜意识世界。
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">产品功能</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>梦境解析</li>
              <li>小说生成</li>
              <li>图片创作</li>
              <li>视频制作</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">社区</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>梦境广场</li>
              <li>创作分享</li>
              <li>用户论坛</li>
              <li>创作指南</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">支持</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>帮助中心</li>
              <li>API 文档</li>
              <li>联系我们</li>
              <li>隐私政策</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 flex items-center justify-between text-sm text-gray-400">
          <p>&copy; 2024 梦境之书. All rights reserved.</p>
          <p>Powered by AI Technology</p>
        </div>
      </footer>
    </div>
  );
}
