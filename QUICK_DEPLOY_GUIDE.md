# 🚀 梦境之书快速部署指南

## 📋 部署前准备清单

### ✅ 必需配置
- [ ] **NextAuth密钥**: `openssl rand -base64 32`
- [ ] **数据库**: PostgreSQL连接字符串
- [ ] **域名**: 生产环境域名

### 🔧 推荐配置
- [ ] **OpenAI API**: AI功能（可选，有fallback）
- [ ] **Google OAuth**: 第三方登录
- [ ] **GitHub OAuth**: 第三方登录
- [ ] **Resend邮件**: 通知服务
- [ ] **Stripe支付**: 订阅功能

## 🚀 Vercel一键部署

### 1. 准备GitHub仓库
```bash
git add .
git commit -m "准备生产部署"
git push origin main
```

### 2. 在Vercel导入项目
1. 访问 https://vercel.com
2. 点击 "New Project"
3. 从GitHub导入仓库
4. 选择 "aidreambook" 项目

### 3. 配置环境变量
在Vercel项目设置中添加：

#### 必需变量
```
NEXTAUTH_URL=https://your-project.vercel.app
NEXTAUTH_SECRET=your-generated-secret
DATABASE_URL=your-postgresql-connection-string
```

#### 可选变量（启用更多功能）
```
OPENAI_API_KEY=sk-your-api-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-secret
RESEND_API_KEY=re_your-resend-key
FROM_EMAIL=noreply@yourdomain.com
```

### 4. 部署
点击 "Deploy" 开始部署

## 🗄️ 数据库快速设置

### 推荐：Supabase免费版
1. 访问 https://supabase.com
2. 创建新项目
3. 获取PostgreSQL连接字符串
4. 添加到Vercel环境变量

### 初始化数据库
```bash
# 在Vercel部署后运行
DATABASE_URL="your-production-url" bunx prisma db push
DATABASE_URL="your-production-url" bun tsx prisma/seed.ts
```

## 🔐 OAuth快速配置

### Google OAuth
1. 访问 https://console.cloud.google.com
2. 创建项目 > API和服务 > 凭据
3. 创建OAuth 2.0客户端ID
4. 授权重定向URI: `https://your-domain.com/api/auth/callback/google`

### GitHub OAuth
1. 访问 https://github.com/settings/developers
2. 新建OAuth App
3. Authorization callback URL: `https://your-domain.com/api/auth/callback/github`

## ✉️ 邮件服务配置

### Resend（推荐）
1. 访问 https://resend.com
2. 获取API密钥
3. 配置发件域名（可选）

## 🎯 部署后验证

访问您的网站并测试：
- [ ] 首页正常显示
- [ ] 用户注册登录功能
- [ ] OAuth登录（如已配置）
- [ ] AI生成功能
- [ ] 邮件通知（如已配置）

## 🆘 常见问题

### 1. 部署失败
- 检查环境变量配置
- 确认数据库连接正常
- 查看Vercel部署日志

### 2. OAuth登录失败
- 检查回调URL配置
- 确认客户端ID和密钥正确
- 检查域名配置

### 3. AI功能不工作
- 检查OpenAI API密钥
- 确认API配额充足
- 查看应用日志

### 4. 数据库连接问题
- 检查连接字符串格式
- 确认数据库防火墙设置
- 验证用户权限

## 📞 获取帮助

如果遇到问题：
1. 检查部署日志
2. 查看环境变量配置
3. 参考详细的PRODUCTION_SETUP.md
4. 查看OAUTH_SETUP_GUIDE.md

---

## 🎉 部署成功！

完成部署后，您的梦境之书就可以为用户提供服务了！

享受您的AI驱动梦境创作平台！ ✨
