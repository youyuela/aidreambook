"use client";
import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, UserPlus, Mail, Lock, User, Github, Chrome, Brain, Sparkles, Check } from "lucide-react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [signUpMethod, setSignUpMethod] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const validateForm = () => {
    const newErrors: string[] = [];

    if (!formData.name.trim()) newErrors.push("请输入姓名");
    if (!formData.email) newErrors.push("请输入邮箱地址");
    if (!formData.email.includes("@")) newErrors.push("请输入有效的邮箱地址");
    if (!formData.password) newErrors.push("请输入密码");
    if (formData.password.length < 6) newErrors.push("密码至少需要6位字符");
    if (formData.password !== formData.confirmPassword) newErrors.push("两次输入的密码不一致");
    if (!agreedToTerms) newErrors.push("请同意服务条款和隐私政策");

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setSignUpMethod("email");

    try {
      // 由于这是演示版本，我们直接使用signIn来模拟注册
      // 在实际应用中，您需要先调用注册API，然后再登录
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        callbackUrl,
        redirect: false,
      });

      if (result?.error) {
        setErrors(["注册失败，邮箱可能已被使用"]);
      } else {
        router.push(callbackUrl);
      }
    } catch (error) {
      console.error("Sign up error:", error);
      setErrors(["注册失败，请重试"]);
    } finally {
      setIsLoading(false);
      setSignUpMethod(null);
    }
  };

  const handleOAuthSignUp = async (provider: string) => {
    if (!agreedToTerms) {
      setErrors(["请同意服务条款和隐私政策"]);
      return;
    }

    setIsLoading(true);
    setSignUpMethod(provider);

    try {
      await signIn(provider, { callbackUrl });
    } catch (error) {
      console.error("OAuth sign up error:", error);
      setErrors(["第三方注册失败，请重试"]);
    } finally {
      setIsLoading(false);
      setSignUpMethod(null);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors.length > 0) setErrors([]);
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
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-white">开始创作之旅</CardTitle>
            <CardDescription className="text-gray-400">
              注册账户，解锁AI梦境创作的无限可能
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* 错误提示 */}
            {errors.length > 0 && (
              <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <div className="flex items-start gap-2 text-red-400">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div className="text-sm space-y-1">
                    {errors.map((error, index) => (
                      <div key={`error-${index}-${error.slice(0, 10)}`}>{error}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* OAuth 注册选项 */}
            <div className="space-y-3">
              <Button
                onClick={() => handleOAuthSignUp("google")}
                disabled={isLoading}
                variant="outline"
                className="w-full border-white/10 hover:bg-white/5"
              >
                {isLoading && signUpMethod === "google" ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Chrome className="w-4 h-4 mr-2" />
                )}
                使用 Google 注册
              </Button>

              <Button
                onClick={() => handleOAuthSignUp("github")}
                disabled={isLoading}
                variant="outline"
                className="w-full border-white/10 hover:bg-white/5"
              >
                {isLoading && signUpMethod === "github" ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Github className="w-4 h-4 mr-2" />
                )}
                使用 GitHub 注册
              </Button>
            </div>

            <div className="relative">
              <Separator className="bg-white/10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-background px-2 text-sm text-gray-400">或</span>
              </div>
            </div>

            {/* 邮箱注册表单 */}
            <form onSubmit={handleEmailSignUp} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-white">姓名</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="您的姓名"
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                  className="mt-1 bg-black/20 border-white/10 text-white placeholder:text-gray-500"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-white">邮箱</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  className="mt-1 bg-black/20 border-white/10 text-white placeholder:text-gray-500"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-white">密码</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="至少6位字符"
                  value={formData.password}
                  onChange={(e) => updateFormData("password", e.target.value)}
                  className="mt-1 bg-black/20 border-white/10 text-white placeholder:text-gray-500"
                  required
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-white">确认密码</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="再次输入密码"
                  value={formData.confirmPassword}
                  onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                  className="mt-1 bg-black/20 border-white/10 text-white placeholder:text-gray-500"
                  required
                />
              </div>

              {/* 条款同意 */}
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => {
                    setAgreedToTerms(checked as boolean);
                    if (errors.length > 0) setErrors([]);
                  }}
                  className="mt-1"
                />
                <div className="text-sm text-gray-400">
                  <label htmlFor="terms" className="cursor-pointer">
                    我同意{" "}
                    <Link href="/terms" className="text-purple-400 hover:text-purple-300">
                      服务条款
                    </Link>{" "}
                    和{" "}
                    <Link href="/privacy" className="text-purple-400 hover:text-purple-300">
                      隐私政策
                    </Link>
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !agreedToTerms}
                className="w-full dream-gradient"
              >
                {isLoading && signUpMethod === "email" ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    注册中...
                  </div>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    创建账户
                  </>
                )}
              </Button>
            </form>

            {/* 登录链接 */}
            <div className="text-center">
              <p className="text-sm text-gray-400">
                已有账户？{" "}
                <Link
                  href={`/auth/signin${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`}
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  立即登录
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 功能预览 */}
        <Card className="glass-card mt-4">
          <CardContent className="p-4">
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              免费版功能
            </h4>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Check className="w-3 h-3 text-green-400" />
                <span>每月10次AI生成</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3 h-3 text-green-400" />
                <span>基础梦境解析</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3 h-3 text-green-400" />
                <span>标准图片生成</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3 h-3 text-green-400" />
                <span>社区作品浏览</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              注册即可立即开始您的梦境创作之旅
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SignUp() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpForm />
    </Suspense>
  );
}
