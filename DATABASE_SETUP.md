# 生产环境数据库配置指南

## 数据库服务推荐（免费）

### 1. Supabase（推荐）
- 免费额度：500MB数据库 + 50,000 API请求/月
- PostgreSQL 15
- 注册地址：https://supabase.com

### 2. Railway
- 免费额度：512MB数据库
- PostgreSQL
- 注册地址：https://railway.app

### 3. Neon
- 免费额度：512MB数据库
- PostgreSQL 15
- 注册地址：https://neon.tech

## 配置步骤

### 第一步：创建数据库
1. 选择上述任一服务注册账户
2. 创建新的PostgreSQL数据库项目
3. 获取数据库连接字符串（格式如下）：
   ```
   postgresql://username:password@host:port/database?sslmode=require
   ```

### 第二步：配置环境变量
复制下面的内容到 .env.local 文件中，并填入真实值：

```env
# 数据库配置
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

# NextAuth配置
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key-here-generate-a-long-random-string"

# OAuth 提供商（可选，先用邮箱登录）
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# OpenAI API（如果有的话）
OPENAI_API_KEY="sk-your-openai-api-key"
OPENAI_ORG_ID="org-your-organization-id"

# Stripe（如果要测试支付）
STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"
STRIPE_PUBLISHABLE_KEY="pk_test_your-stripe-publishable-key"
STRIPE_WEBHOOK_SECRET="whsec_your-webhook-secret"

# 应用配置
NODE_ENV="development"
APP_URL="http://localhost:3000"
```

### 第三步：运行迁移命令
```bash
# 1. 生成Prisma客户端
bun prisma generate

# 2. 推送数据库结构（首次部署）
bun prisma db push

# 3. 查看数据库（可选）
bun prisma studio
```
