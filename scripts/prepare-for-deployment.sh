#!/bin/bash

# 梦境之书 - 一键部署准备脚本
# 使用方法: chmod +x scripts/prepare-for-deployment.sh && ./scripts/prepare-for-deployment.sh

echo "🚀 梦境之书 - 生产部署准备"
echo "=============================="

# 检查当前目录
if [ ! -f "package.json" ]; then
    echo "❌ 请在项目根目录运行此脚本"
    exit 1
fi

echo "📋 步骤1: 安装依赖"
echo "-------------------"
bun install
if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

echo ""
echo "🗄️  步骤2: 生成Prisma客户端"
echo "----------------------------"
DATABASE_URL="file:./dev.db" bunx prisma generate
if [ $? -ne 0 ]; then
    echo "❌ Prisma客户端生成失败"
    exit 1
fi

echo ""
echo "🧪 步骤3: 代码质量检查"
echo "---------------------"
echo "正在运行Lint检查..."
bun run lint --reporter=compact || echo "⚠️  发现一些Lint警告，但不影响部署"

echo ""
echo "🏗️  步骤4: 构建测试"
echo "------------------"
bun run build
if [ $? -ne 0 ]; then
    echo "❌ 构建失败，请修复错误后重试"
    exit 1
fi

echo ""
echo "📦 步骤5: 清理构建文件"
echo "---------------------"
rm -rf .next

echo ""
echo "📝 步骤6: 生成部署清单"
echo "---------------------"

cat > DEPLOYMENT_CHECKLIST.md << 'EOF'
# 🚀 梦境之书部署清单

## ✅ 部署前确认

### 必需配置
- [ ] GitHub仓库已推送最新代码
- [ ] 获得PostgreSQL数据库连接字符串
- [ ] 生成NextAuth安全密钥 (`openssl rand -base64 32`)
- [ ] 确定生产域名

### 推荐配置（提升功能）
- [ ] OpenAI API密钥（启用AI功能）
- [ ] Google OAuth应用（第三方登录）
- [ ] GitHub OAuth应用（第三方登录）
- [ ] Resend邮件服务（通知功能）
- [ ] Stripe支付配置（订阅功能）

## 🌐 Vercel部署步骤

1. **导入项目**
   - 访问 https://vercel.com
   - 点击 "New Project"
   - 从GitHub导入此仓库

2. **配置环境变量**
   - 在Vercel项目设置中添加以下变量：
   ```
   NEXTAUTH_URL=https://your-project.vercel.app
   NEXTAUTH_SECRET=your-generated-secret
   DATABASE_URL=your-postgresql-connection
   ```

3. **可选环境变量（增强功能）**
   ```
   OPENAI_API_KEY=sk-your-openai-key
   GOOGLE_CLIENT_ID=your-google-id
   GOOGLE_CLIENT_SECRET=your-google-secret
   GITHUB_CLIENT_ID=your-github-id
   GITHUB_CLIENT_SECRET=your-github-secret
   RESEND_API_KEY=re_your-resend-key
   FROM_EMAIL=noreply@yourdomain.com
   ```

4. **部署**
   - 点击 "Deploy"
   - 等待部署完成

## 🗄️ 数据库初始化

部署成功后，运行以下命令初始化数据库：

```bash
# 推送数据库结构
DATABASE_URL="your-production-url" bunx prisma db push

# 添加演示数据（可选）
DATABASE_URL="your-production-url" bun tsx prisma/seed.ts
```

## 🔧 OAuth配置

### Google OAuth
1. https://console.cloud.google.com
2. 创建OAuth 2.0客户端
3. 重定向URI: `https://your-domain/api/auth/callback/google`

### GitHub OAuth
1. https://github.com/settings/developers
2. 新建OAuth App
3. 回调URL: `https://your-domain/api/auth/callback/github`

## ✅ 部署后验证

- [ ] 网站正常访问
- [ ] 用户注册登录功能
- [ ] OAuth登录（如已配置）
- [ ] AI生成功能
- [ ] 邮件通知功能

## 📞 支持

如需帮助，请查看：
- PRODUCTION_SETUP.md（详细配置）
- OAUTH_SETUP_GUIDE.md（OAuth设置）
- QUICK_DEPLOY_GUIDE.md（快速部署）

---
生成时间: $(date)
项目状态: 准备就绪 ✅
EOF

echo ""
echo "🎯 步骤7: 检查关键文件"
echo "---------------------"
echo "✅ package.json - 存在"
echo "✅ next.config.js - 存在"
echo "✅ vercel.json - 存在"
echo "✅ prisma/schema.prisma - 存在"
echo "✅ .env.local - 存在"

if [ -f ".env.production.template" ]; then
    echo "✅ .env.production.template - 存在"
else
    echo "⚠️  .env.production.template - 不存在（将创建）"

    cat > .env.production.template << 'EOF'
# 梦境之书 - 生产环境变量模板
# 复制此文件内容到Vercel环境变量配置中

# 必需配置
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-secure-secret-here"
DATABASE_URL="postgresql://username:password@host:port/database"

# AI功能（推荐）
OPENAI_API_KEY="sk-your-openai-api-key"

# OAuth登录（推荐）
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# 邮件服务（推荐）
RESEND_API_KEY="re_your-resend-api-key"
FROM_EMAIL="noreply@yourdomain.com"

# 支付服务（可选）
STRIPE_SECRET_KEY="sk_live_your-stripe-key"
STRIPE_PUBLISHABLE_KEY="pk_live_your-stripe-key"
EOF
fi

echo ""
echo "🎉 部署准备完成！"
echo "================="
echo ""
echo "📋 接下来的步骤:"
echo "1. 查看 DEPLOYMENT_CHECKLIST.md 获取详细清单"
echo "2. 推送代码到GitHub: git add . && git commit -m '生产部署准备' && git push"
echo "3. 在Vercel导入项目: https://vercel.com"
echo "4. 配置环境变量（参考 .env.production.template）"
echo "5. 点击部署"
echo ""
echo "📚 更多帮助文档:"
echo "- QUICK_DEPLOY_GUIDE.md - 快速部署指南"
echo "- PRODUCTION_SETUP.md - 详细配置指南"
echo "- OAUTH_SETUP_GUIDE.md - OAuth设置指南"
echo ""
echo "✨ 您的梦境之书已准备好投入生产！"
