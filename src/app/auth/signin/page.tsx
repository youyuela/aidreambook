"use client";

import { useState } from "react";
import { signIn, getProviders } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, LogIn, Mail, Github, Chrome, Brain, Sparkles } from "lucide-react";
import Link from "next/link";

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const error = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [signInMethod, setSignInMethod] = useState<string | null>(null);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSignInMethod("email");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        callbackUrl,
        redirect: false,
      });

      if (result?.error) {
        console.error("Sign in error:", result.error);
      } else {
        router.push(callbackUrl);
      }
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
      setSignInMethod(null);
    }
  };

  const handleOAuthSignIn = async (provider: string) => {
    setIsLoading(true);
    setSignInMethod(provider);

    try {
      await signIn(provider, { callbackUrl });
    } catch (error) {
      console.error("OAuth sign in error:", error);
    } finally {
      setIsLoading(false);
      setSignInMethod(null);
    }
  };

  const getErrorMessage = (error: string) => {
    switch (error) {
      case "CredentialsSignin":
        return "邮箱或密码错误，请重试";
      case "EmailSignin":
        return "邮箱登录失败，请检查邮箱地址";
      case "OAuthSignin":
        return "第三方登录失败，请重试";
      case "OAuthCallback":
        return "第三方登录回调失败";
      case "OAuthCreateAccount":
        return "无法创建账户，请重试";
      case "EmailCreateAccount":
        return "无法创建账户，邮箱可能已被使用";
      case "Callback":
        return "登录回调失败";
      case "OAuthAccountNotLinked":
        return "该邮箱已使用其他方式注册，请使用对应方式登录";
      case "SessionRequired":
        return "需要登录才能访问该页面";
      default:
        return "登录失败，请重试";
    }
  };

  return (
    <div className="min-h-screen dream-bg flex items-center justify-center p-4">
      {/* 导航栏 */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 dream-gradient rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold dream-text-gradient">梦境之书</span>
          </Link>
        </nav>
      </div>

      <div className="w-full max-w-md z-20">
        <Card className="glass-card">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 dream-gradient rounded-full flex items-center justify-center">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-white">欢迎回来</CardTitle>
            <CardDescription className="text-gray-400">
              登录您的账户，继续您的梦境创作之旅
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* 错误提示 */}
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <div className="flex items-center gap-2 text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{getErrorMessage(error)}</span>
                </div>
              </div>
            )}

            {/* OAuth 登录选项 */}
            <div className="space-y-3">
              <Button
                onClick={() => handleOAuthSignIn("google")}
                disabled={isLoading}
                variant="outline"
                className="w-full border-white/10 hover:bg-white/5"
              >
                {isLoading && signInMethod === "google" ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Chrome className="w-4 h-4 mr-2" />
                )}
                使用 Google 登录
              </Button>

              <Button
                onClick={() => handleOAuthSignIn("github")}
                disabled={isLoading}
                variant="outline"
                className="w-full border-white/10 hover:bg-white/5"
              >
                {isLoading && signInMethod === "github" ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Github className="w-4 h-4 mr-2" />
                )}
                使用 GitHub 登录
              </Button>
            </div>

            <div className="relative">
              <Separator className="bg-white/10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-background px-2 text-sm text-gray-400">或</span>
              </div>
            </div>

            {/* 邮箱登录表单 */}
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-white">邮箱</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 bg-black/20 border-white/10 text-white placeholder:text-gray-500"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-white">密码</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="输入您的密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 bg-black/20 border-white/10 text-white placeholder:text-gray-500"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading || !email || !password}
                className="w-full dream-gradient"
              >
                {isLoading && signInMethod === "email" ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    登录中...
                  </div>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    邮箱登录
                  </>
                )}
              </Button>
            </form>

            {/* 注册链接 */}
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-400">
                还没有账户？{" "}
                <Link
                  href={`/auth/signup${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`}
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  立即注册
                </Link>
              </p>

              <p className="text-xs text-gray-500">
                登录即表示您同意我们的{" "}
                <Link href="/terms" className="text-purple-400 hover:text-purple-300">
                  服务条款
                </Link>{" "}
                和{" "}
                <Link href="/privacy" className="text-purple-400 hover:text-purple-300">
                  隐私政策
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 演示账户提示 */}
        <Card className="glass-card mt-4">
          <CardContent className="p-4">
            <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              演示账户
            </h4>
            <div className="text-sm text-gray-400 space-y-1">
              <p>普通用户: demo@aidreambook.com</p>
              <p>专家用户: expert@aidreambook.com</p>
              <p className="text-xs text-gray-500 mt-2">
                您可以使用任意密码登录演示账户体验功能
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
