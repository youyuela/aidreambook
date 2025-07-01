# 🌟 梦境之书 (AI Dream Book)

> AI驱动的梦境创作平台 - 将您的梦境转化为精美的小说、图片和视频

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2d3748)](https://prisma.io/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-10a37f)](https://openai.com/)

## 🎯 项目简介

梦境之书是一个现代化的SaaS平台，使用最先进的AI技术将用户的梦境描述转化为：
- 📖 **专业梦境解析** - 基于心理学理论的深度分析
- 📚 **精彩小说创作** - 约1000字的梦境故事
- 🎨 **艺术图片生成** - 高质量的梦境视觉作品
- 🎬 **动态视频制作** - 15秒梦境动画视频

## ✨ 主要特性

### 🎨 精美设计
- 🌌 **梦幻星空主题** - 独特的UI设计，营造梦境氛围
- 🔮 **玻璃磨砂效果** - 现代化视觉设计语言
- 📱 **响应式布局** - 完美适配各种设备

### 🤖 AI技术栈
- 🧠 **OpenAI GPT-4** - 专业梦境解析和小说创作
- 🎨 **DALL-E 3** - 高质量图片生成
- 🎬 **视频生成API** - 预留RunwayML等服务接口
- 🔄 **智能回退机制** - 未配置API时自动降级到模拟模式

### 💼 完整SaaS功能
- 🔐 **用户认证系统** - NextAuth.js支持多种登录方式
- 💳 **订阅支付** - Stripe集成，4级订阅计划
- 📊 **用户仪表板** - 配额管理、统计分析
- 👨‍💼 **专家认证** - 专业用户认证和特权系统
- ✉️ **邮件通知** - 自动发送欢迎和确认邮件

### 🌐 现代化架构
- ⚡ **Next.js 15** - 最新React框架，App Router
- 🔒 **TypeScript** - 完整类型安全
- 🗄️ **Prisma ORM** - 现代化数据库管理
- 🎨 **shadcn/ui** - 高质量UI组件库
- ☁️ **Vercel部署** - 一键生产部署

## 🚀 快速开始

### 📋 环境要求
- Node.js 18+
- Bun (推荐) 或 npm
- PostgreSQL 数据库 (生产环境)

### 🛠️ 本地开发

1. **克隆项目**
   ```bash
   git clone <your-repo-url>
   cd aidreambook
   ```

2. **安装依赖**
   ```bash
   bun install
   ```

3. **配置环境变量**
   ```bash
   cp .env.local .env.local.backup
   # 编辑 .env.local 填入您的配置
   ```

4. **初始化数据库**
   ```bash
   bun run setup
   ```

5. **启动开发服务器**
   ```bash
   bun dev
   ```

6. **访问应用**

   打开 http://localhost:3000

### 🎮 演示账户

体验完整功能：
- **普通用户**: `demo@aidreambook.com` (任意密码)
- **专家用户**: `expert@aidreambook.com` (任意密码)

## 🚀 生产部署

### 快速部署到Vercel

1. **准备部署**
   ```bash
   ./scripts/prepare-for-deployment.sh
   ```

2. **推送到GitHub**
   ```bash
   git add .
   git commit -m "准备生产部署"
   git push origin main
   ```

3. **在Vercel导入项目**
   - 访问 [vercel.com](https://vercel.com)
   - 点击 "New Project"
   - 从GitHub导入仓库

4. **配置环境变量**

   参考 `.env.production.template` 配置以下变量：
   ```
   NEXTAUTH_URL=https://your-domain.com
   NEXTAUTH_SECRET=your-secure-secret
   DATABASE_URL=your-postgresql-url
   OPENAI_API_KEY=sk-your-openai-key
   ```

5. **部署**

   点击 "Deploy" 开始部署

### 📚 详细部署指南

- [📖 快速部署指南](./QUICK_DEPLOY_GUIDE.md)
- [🔧 生产环境配置](./PRODUCTION_SETUP.md)
- [🔐 OAuth设置指南](./OAUTH_SETUP_GUIDE.md)

## 🏗️ 项目架构

```
aidreambook/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── auth/              # 认证页面
│   │   ├── dashboard/         # 用户仪表板
│   │   ├── pricing/           # 价格页面
│   │   ├── expert/apply/      # 专家认证
│   │   └── api/               # API路由
│   ├── components/            # React组件
│   │   ├── ui/                # shadcn UI组件
│   │   └── providers/         # Context Providers
│   └── lib/                   # 工具库
│       ├── auth.ts            # NextAuth配置
│       ├── prisma.ts          # 数据库客户端
│       ├── stripe.ts          # 支付处理
│       ├── ai-service.ts      # AI服务集成
│       └── email.ts           # 邮件服务
├── prisma/                    # 数据库配置
│   ├── schema.prisma          # 数据库模式
│   └── seed.ts                # 种子数据
└── scripts/                   # 部署脚本
```

## 🔧 核心技术

### 前端技术栈
- **Next.js 15** - React全栈框架
- **TypeScript** - 类型安全的JavaScript
- **Tailwind CSS** - 原子化CSS框架
- **shadcn/ui** - 现代UI组件库
- **Lucide React** - 精美图标库

### 后端技术栈
- **Prisma** - 现代ORM和数据库工具
- **NextAuth.js** - 身份验证解决方案
- **Stripe** - 支付和订阅管理
- **Resend** - 邮件发送服务

### AI服务集成
- **OpenAI GPT-4** - 文本生成和分析
- **DALL-E 3** - 图像生成
- **智能回退** - 未配置时使用模拟数据

## 📊 订阅计划

| 功能 | 免费版 | 基础版 | 专业版 | 专家版 |
|------|--------|--------|--------|--------|
| **月度配额** | 10次 | 100次 | 500次 | 无限制 |
| **梦境解析** | 基础 | 高级 | 专业 | 专家级 |
| **图片生成** | 标准 | 高清 | 4K | 8K超高清 |
| **视频生成** | ❌ | ✅ | ✅ | ✅ |
| **批量处理** | ❌ | ❌ | ✅ | ✅ |
| **API访问** | ❌ | ❌ | ❌ | ✅ |
| **商业授权** | ❌ | ❌ | ✅ | ✅ |
| **专属支持** | ❌ | 邮件 | 优先 | 一对一 |

## 🌟 主要功能

### 🎨 梦境创作流程
1. **描述梦境** - 输入您的梦境内容（最多1000字符）
2. **AI分析** - 专业的心理学角度梦境解析
3. **内容生成** - 自动生成小说、图片、视频
4. **编辑分享** - 个性化编辑并分享到社交平台

### 👥 用户管理
- **多种登录方式** - 邮箱、Google、GitHub
- **配额管理** - 智能的使用限制和重置
- **订阅管理** - 灵活的计划升级和续费
- **统计分析** - 详细的创作数据和趋势

### 🏆 专家认证系统
- **专业认证** - 心理学、文学等领域专家
- **特殊权限** - 社区指导和内容审核
- **专家徽章** - 权威性标识显示

## 🛡️ 安全特性

- 🔐 **JWT安全认证** - 基于NextAuth.js的安全会话
- 🛡️ **API速率限制** - 防止滥用和攻击
- 🔒 **环境变量保护** - 敏感信息安全存储
- 🚫 **输入验证** - 严格的数据验证和清理
- 📝 **审计日志** - 重要操作记录

## 📈 性能优化

- ⚡ **Next.js SSR** - 服务端渲染优化
- 🔄 **智能缓存** - Redis缓存策略
- 📦 **代码分割** - 按需加载组件
- 🖼️ **图片优化** - 自动压缩和格式转换
- 📱 **PWA支持** - 渐进式Web应用

## 🌍 国际化

- 🇨🇳 **中文支持** - 完整的中文界面
- 🇺🇸 **英文支持** - 国际化用户体验
- 🌐 **多语言扩展** - 易于添加新语言
- 📅 **本地化格式** - 日期、时间、货币格式

## 🤝 贡献指南

欢迎参与项目贡献！

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Next.js](https://nextjs.org/) - 强大的React框架
- [OpenAI](https://openai.com/) - 先进的AI技术
- [shadcn/ui](https://ui.shadcn.com/) - 优秀的UI组件
- [Vercel](https://vercel.com/) - 卓越的部署平台

## 📞 支持与联系

- 📧 **邮箱**: support@aidreambook.com
- 💬 **论坛**: [GitHub Discussions](https://github.com/yourusername/aidreambook/discussions)
- 🐛 **问题反馈**: [GitHub Issues](https://github.com/yourusername/aidreambook/issues)
- 📖 **文档**: [项目Wiki](https://github.com/yourusername/aidreambook/wiki)

---

<div align="center">

**🌟 如果这个项目对您有帮助，请给我们一个星标！**

Made with ❤️ by the AI Dream Book Team

</div>
