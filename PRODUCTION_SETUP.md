# 🚀 梦境之书 - 生产环境部署指南

本指南将帮助您将梦境之书部署到生产环境，包括所有必要的服务配置。

## 📋 部署前检查清单

- [ ] 获取OpenAI API密钥
- [ ] 创建PostgreSQL数据库
- [ ] 配置Google OAuth
- [ ] 配置GitHub OAuth
- [ ] 设置Stripe支付
- [ ] 配置邮件服务
- [ ] Vercel部署配置

## 🔧 详细配置步骤

### 1. 📊 OpenAI API配置

1. 前往 [OpenAI Platform](https://platform.openai.com/api-keys)
2. 创建新的API密钥
3. 复制密钥并保存到环境变量：
   ```env
   OPENAI_API_KEY="sk-your-actual-api-key-here"
   OPENAI_ORG_ID="org-your-organization-id"
   ```

### 2. 🗃️ PostgreSQL数据库配置

#### 选项A: Supabase (推荐免费)
1. 前往 [Supabase](https://supabase.com) 创建账户
2. 创建新项目
3. 在项目设置中找到数据库连接字符串
4. 配置环境变量：
   ```env
   DATABASE_PROVIDER="postgresql"
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
   ```

#### 选项B: Railway
1. 前往 [Railway](https://railway.app) 创建账户
2. 创建新项目，添加PostgreSQL服务
3. 获取连接字符串

#### 选项C: Neon
1. 前往 [Neon](https://neon.tech) 创建账户
2. 创建数据库项目
3. 获取连接字符串

### 3. 🔐 Google OAuth配置

1. 前往 [Google Cloud Console](https://console.cloud.google.com)
2. 创建新项目或选择现有项目
3. 启用Google+ API
4. 创建OAuth 2.0客户端ID：
   - 应用类型：Web应用程序
   - 授权的重定向URI：`https://yourdomain.com/api/auth/callback/google`
5. 配置环境变量：
   ```env
   GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="your-client-secret"
   ```

### 4. 🐙 GitHub OAuth配置

1. 前往 [GitHub Developer Settings](https://github.com/settings/developers)
2. 创建新的GitHub App或OAuth App
3. 配置：
   - Homepage URL: `https://yourdomain.com`
   - Authorization callback URL: `https://yourdomain.com/api/auth/callback/github`
4. 配置环境变量：
   ```env
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"
   ```

### 5. 💳 Stripe支付配置

1. 前往 [Stripe Dashboard](https://dashboard.stripe.com)
2. 获取API密钥（先使用测试密钥）
3. 创建产品和价格：
   - 基础版：$9.99/月
   - 专业版：$29.99/月
   - 专家版：$99.99/月
4. 设置Webhook端点：`https://yourdomain.com/api/webhooks/stripe`
5. 配置环境变量：
   ```env
   STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"
   STRIPE_PUBLISHABLE_KEY="pk_test_your-stripe-publishable-key"
   STRIPE_WEBHOOK_SECRET="whsec_your-webhook-secret"
   STRIPE_BASIC_PRICE_ID="price_basic_plan_id"
   STRIPE_PRO_PRICE_ID="price_pro_plan_id"
   STRIPE_EXPERT_PRICE_ID="price_expert_plan_id"
   ```

### 6. ✉️ 邮件服务配置 (可选)

#### 选项A: Resend (推荐)
1. 前往 [Resend](https://resend.com) 创建账户
2. 获取API密钥
3. 配置环境变量：
   ```env
   RESEND_API_KEY="re_your-api-key"
   FROM_EMAIL="noreply@yourdomain.com"
   ```

#### 选项B: SendGrid
1. 前往 [SendGrid](https://sendgrid.com) 创建账户
2. 创建API密钥
3. 配置环境变量：
   ```env
   SENDGRID_API_KEY="SG.your-api-key"
   FROM_EMAIL="noreply@yourdomain.com"
   ```

### 7. 🌐 Vercel部署配置

1. 前往 [Vercel](https://vercel.com) 并连接GitHub
2. 导入您的项目仓库
3. 配置环境变量（将所有.env.local中的变量添加到Vercel）
4. 设置构建命令：
   ```bash
   npm run build
   ```
5. 设置输出目录：`.next`

## 📝 完整环境变量模板

创建生产环境的环境变量文件：

```env
# 应用基础配置
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-very-secure-random-string-32-chars"
APP_URL="https://yourdomain.com"
NODE_ENV="production"

# 数据库配置
DATABASE_PROVIDER="postgresql"
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

# OpenAI API
OPENAI_API_KEY="sk-your-openai-api-key"
OPENAI_ORG_ID="org-your-organization-id"

# OAuth提供商
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Stripe支付
STRIPE_SECRET_KEY="sk_live_your-stripe-secret-key"
STRIPE_PUBLISHABLE_KEY="pk_live_your-stripe-publishable-key"
STRIPE_WEBHOOK_SECRET="whsec_your-webhook-secret"
STRIPE_BASIC_PRICE_ID="price_basic_plan_id"
STRIPE_PRO_PRICE_ID="price_pro_plan_id"
STRIPE_EXPERT_PRICE_ID="price_expert_plan_id"

# 邮件服务 (可选)
RESEND_API_KEY="re_your-api-key"
FROM_EMAIL="noreply@yourdomain.com"

# 文件存储 (可选)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

## 🚀 部署步骤

### 1. 准备代码
```bash
# 确保所有依赖已安装
bun install

# 运行Lint检查
bun run lint

# 构建测试
bun run build
```

### 2. 数据库迁移
```bash
# 生成Prisma客户端
bunx prisma generate

# 运行数据库迁移（生产环境）
DATABASE_URL="your-production-db-url" bunx prisma db push

# 添加初始数据（可选）
DATABASE_URL="your-production-db-url" bun tsx prisma/seed.ts
```

### 3. Vercel部署
1. 推送代码到GitHub
2. 在Vercel导入项目
3. 配置所有环境变量
4. 部署

### 4. 域名配置
1. 在Vercel项目设置中添加自定义域名
2. 更新DNS记录指向Vercel
3. 启用SSL证书（自动）

### 5. 验证部署
- [ ] 网站可以正常访问
- [ ] 用户注册/登录功能正常
- [ ] OAuth登录正常工作
- [ ] AI生成功能正常
- [ ] 支付流程正常
- [ ] 邮件通知正常

## 🔧 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查DATABASE_URL格式
   - 确认数据库服务运行正常
   - 检查防火墙设置

2. **OAuth登录失败**
   - 检查回调URL配置
   - 确认客户端ID和密钥正确
   - 检查域名配置

3. **AI生成失败**
   - 检查OpenAI API密钥
   - 确认API配额充足
   - 检查网络连接

4. **支付功能异常**
   - 检查Stripe密钥配置
   - 确认Webhook URL可访问
   - 检查产品价格ID

## 📊 监控和维护

### 推荐监控工具
- **Vercel Analytics** - 网站性能监控
- **Sentry** - 错误追踪
- **Uptime Robot** - 服务可用性监控
- **LogRocket** - 用户行为分析

### 定期维护任务
- [ ] 监控API使用量和成本
- [ ] 备份数据库
- [ ] 更新依赖包
- [ ] 检查安全漏洞
- [ ] 性能优化

## 🎯 上线后优化

1. **性能优化**
   - 启用CDN
   - 图片优化
   - 代码分割

2. **安全加固**
   - 配置CORS
   - 添加速率限制
   - 安全头设置

3. **用户体验**
   - 添加分析工具
   - A/B测试
   - 用户反馈收集

---

## 🎉 恭喜！

完成所有配置后，您的梦境之书就可以正式上线为用户服务了！

如果遇到任何问题，请参考故障排除部分或联系技术支持。
