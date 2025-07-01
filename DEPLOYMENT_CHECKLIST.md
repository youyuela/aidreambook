# 🚀 梦境之书 - 生产部署检查清单

使用此清单确保您的梦境之书项目已准备好投入生产使用。

## 📋 部署前检查

### ✅ 代码质量
- [ ] 运行 `bun run lint` 无错误
- [ ] 运行 `bun run build` 构建成功
- [ ] 所有测试通过
- [ ] 代码已提交到Git仓库

### 🔧 环境配置

#### 必需配置
- [ ] `NEXTAUTH_URL` - 设置为生产域名
- [ ] `NEXTAUTH_SECRET` - 设置安全的随机字符串
- [ ] `DATABASE_URL` - PostgreSQL连接字符串
- [ ] `DATABASE_PROVIDER` - 设置为 "postgresql"

#### 可选但推荐的配置
- [ ] `OPENAI_API_KEY` - OpenAI API密钥（AI功能）
- [ ] `OPENAI_ORG_ID` - OpenAI组织ID
- [ ] `GOOGLE_CLIENT_ID` - Google OAuth客户端ID
- [ ] `GOOGLE_CLIENT_SECRET` - Google OAuth客户端密钥
- [ ] `GITHUB_CLIENT_ID` - GitHub OAuth客户端ID
- [ ] `GITHUB_CLIENT_SECRET` - GitHub OAuth客户端密钥
- [ ] `RESEND_API_KEY` - Resend邮件服务API密钥
- [ ] `FROM_EMAIL` - 发件邮箱地址

#### Stripe支付配置（可选）
- [ ] `STRIPE_SECRET_KEY` - Stripe密钥
- [ ] `STRIPE_PUBLISHABLE_KEY` - Stripe公开密钥
- [ ] `STRIPE_WEBHOOK_SECRET` - Stripe Webhook密钥
- [ ] `STRIPE_BASIC_PRICE_ID` - 基础版价格ID
- [ ] `STRIPE_PRO_PRICE_ID` - 专业版价格ID
- [ ] `STRIPE_EXPERT_PRICE_ID` - 专家版价格ID

### 🗃️ 数据库设置
- [ ] PostgreSQL数据库已创建
- [ ] 数据库连接测试通过
- [ ] 运行 `bun run setup:production-db` 完成迁移
- [ ] 种子数据已添加（可选）

### 🔐 OAuth配置
- [ ] 运行 `bun run verify:oauth` 检查配置
- [ ] Google OAuth应用已创建
- [ ] GitHub OAuth应用已创建
- [ ] 回调URL已正确配置
- [ ] 测试OAuth登录功能

### ✉️ 邮件服务
- [ ] 运行 `bun run test:email` 测试邮件
- [ ] Resend账户已创建
- [ ] 发件域名已验证
- [ ] 测试邮件发送成功

### 🤖 AI服务
- [ ] 运行 `bun run test:openai` 测试API
- [ ] OpenAI账户有足够余额
- [ ] API密钥权限正确
- [ ] 测试AI生成功能

## 🌐 Vercel部署步骤

### 1. 推送代码到GitHub
```bash
git add .
git commit -m "准备生产部署"
git push origin main
```

### 2. 在Vercel创建项目
- [ ] 访问 [vercel.com](https://vercel.com)
- [ ] 导入GitHub仓库
- [ ] 选择 "Next.js" 框架预设

### 3. 配置环境变量
在Vercel项目设置中添加所有环境变量：

```bash
# 运行此命令查看需要配置的变量
bun run deploy:prepare
```

### 4. 部署配置
- [ ] 构建命令：`bun run build`
- [ ] 输出目录：`.next`
- [ ] 安装命令：`bun install`
- [ ] Node.js版本：18.x 或更高

### 5. 域名配置（可选）
- [ ] 添加自定义域名
- [ ] 配置DNS记录
- [ ] SSL证书自动配置
- [ ] 更新OAuth回调URL

## 🧪 部署后测试

### 基本功能测试
- [ ] 网站正常访问
- [ ] 用户注册功能
- [ ] 邮箱登录功能
- [ ] 页面导航正常

### OAuth登录测试
- [ ] Google登录功能
- [ ] GitHub登录功能
- [ ] 用户信息正确显示
- [ ] 登出功能正常

### AI功能测试
- [ ] 梦境输入表单
- [ ] AI生成流程
- [ ] 结果展示页面
- [ ] 下载和分享功能

### 支付功能测试（如已配置）
- [ ] 价格页面显示
- [ ] 订阅流程
- [ ] Webhook处理
- [ ] 用户配额更新

### 邮件通知测试
- [ ] 注册欢迎邮件
- [ ] 专家申请确认邮件
- [ ] 订阅成功邮件

## 📊 监控和维护

### 设置监控
- [ ] Vercel Analytics
- [ ] Sentry错误追踪
- [ ] Uptime监控
- [ ] 数据库监控

### 性能优化
- [ ] 图片优化
- [ ] 代码分割
- [ ] CDN配置
- [ ] 缓存策略

### 安全配置
- [ ] CORS设置
- [ ] 速率限制
- [ ] 安全头配置
- [ ] 输入验证

### 备份和恢复
- [ ] 数据库备份计划
- [ ] 环境变量备份
- [ ] 代码仓库备份
- [ ] 恢复流程测试

## 🎯 部署完成检查

- [ ] 所有功能正常工作
- [ ] 性能表现良好
- [ ] 错误日志检查
- [ ] 用户反馈收集

## 📞 支持资源

### 文档
- [ ] `PRODUCTION_SETUP.md` - 详细配置指南
- [ ] `OAUTH_SETUP_GUIDE.md` - OAuth配置教程
- [ ] `README.md` - 项目说明

### 工具命令
```bash
# 检查所有配置
bun run deploy:prepare

# 测试邮件服务
bun run test:email your@email.com

# 测试OpenAI API
bun run test:openai

# 验证OAuth配置
bun run verify:oauth

# 设置生产数据库
bun run setup:production-db
```

### 服务提供商
- **Vercel**: [vercel.com](https://vercel.com) - 部署平台
- **Supabase**: [supabase.com](https://supabase.com) - PostgreSQL数据库
- **OpenAI**: [platform.openai.com](https://platform.openai.com) - AI服务
- **Resend**: [resend.com](https://resend.com) - 邮件服务
- **Stripe**: [stripe.com](https://stripe.com) - 支付处理

---

## 🎉 部署成功！

完成上述所有检查后，您的梦境之书项目就可以正式投入生产使用了！

记得定期：
- 🔄 更新依赖包
- 📊 检查使用统计
- 🛡️ 更新安全配置
- 💰 监控API成本
- 📧 处理用户反馈
