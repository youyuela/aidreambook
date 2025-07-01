#!/usr/bin/env node

/**
 * 梦境之书生产部署准备脚本
 *
 * 使用方法：
 * bun run scripts/deploy-production.js
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function runCommand(command) {
  return new Promise((resolve, reject) => {
    console.log(`🔄 执行: ${command}`);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ 错误: ${error.message}`);
        reject(error);
      } else {
        console.log(`✅ 完成: ${stdout}`);
        if (stderr) console.log(`⚠️  警告: ${stderr}`);
        resolve(stdout);
      }
    });
  });
}

async function checkEnvironmentVariables() {
  console.log('\n📋 检查生产环境变量配置...');

  const requiredVars = [
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
    'DATABASE_URL',
    'DATABASE_PROVIDER'
  ];

  const optionalVars = [
    'OPENAI_API_KEY',
    'GOOGLE_CLIENT_ID',
    'GITHUB_CLIENT_ID',
    'STRIPE_SECRET_KEY',
    'RESEND_API_KEY'
  ];

  const envPath = path.join(__dirname, '..', '.env.local');

  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local 文件不存在');
    return false;
  }

  const envContent = fs.readFileSync(envPath, 'utf8');

  console.log('\n🔍 必需环境变量检查:');
  let hasAllRequired = true;

  for (const varName of requiredVars) {
    const regex = new RegExp(`^${varName}=(.+)$`, 'm');
    const match = envContent.match(regex);

    if (!match || !match[1] || match[1].includes('your-') || match[1].includes('demo-')) {
      console.log(`❌ ${varName}: 未配置或使用示例值`);
      hasAllRequired = false;
    } else {
      console.log(`✅ ${varName}: 已配置`);
    }
  }

  console.log('\n🔍 可选环境变量检查:');
  for (const varName of optionalVars) {
    const regex = new RegExp(`^${varName}=(.+)$`, 'm');
    const match = envContent.match(regex);

    if (!match || !match[1] || match[1].includes('your-') || match[1] === '""') {
      console.log(`⚠️  ${varName}: 未配置（功能将受限）`);
    } else {
      console.log(`✅ ${varName}: 已配置`);
    }
  }

  return hasAllRequired;
}

async function runTests() {
  console.log('\n🧪 运行测试和检查...');

  try {
    // Lint检查
    await runCommand('cd ' + path.join(__dirname, '..') + ' && bun run lint');

    // 类型检查
    await runCommand('cd ' + path.join(__dirname, '..') + ' && bunx tsc --noEmit');

    // 构建测试
    await runCommand('cd ' + path.join(__dirname, '..') + ' && bun run build');

    return true;
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    return false;
  }
}

async function generateDeploymentGuide() {
  console.log('\n📝 生成部署指南...');

  const guide = `
# 🚀 梦境之书 - 生产部署清单

## ✅ 部署前确认

- [ ] 所有环境变量已配置
- [ ] 数据库连接测试通过
- [ ] 代码构建成功
- [ ] OAuth应用已创建
- [ ] Stripe产品已设置
- [ ] 域名DNS已配置

## 🌐 Vercel部署步骤

### 1. 推送代码到GitHub
\`\`\`bash
git add .
git commit -m "准备生产部署"
git push origin main
\`\`\`

### 2. 导入到Vercel
1. 访问 https://vercel.com
2. 点击 "New Project"
3. 导入您的GitHub仓库
4. 配置项目设置：
   - Framework Preset: Next.js
   - Build Command: \`bun run build\`
   - Output Directory: \`.next\`

### 3. 配置环境变量
在Vercel项目设置中添加以下环境变量：

\`\`\`
NEXTAUTH_URL=https://yourdomain.vercel.app
NEXTAUTH_SECRET=your-secure-secret
DATABASE_PROVIDER=postgresql
DATABASE_URL=your-postgresql-connection-string
OPENAI_API_KEY=your-openai-api-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
RESEND_API_KEY=your-resend-api-key
FROM_EMAIL=noreply@yourdomain.com
\`\`\`

### 4. 部署
点击 "Deploy" 开始部署

### 5. 自定义域名（可选）
1. 在Vercel项目设置中添加域名
2. 配置DNS指向Vercel
3. 等待SSL证书自动配置

## 🗃️ 数据库设置

如果使用PostgreSQL生产数据库：

\`\`\`bash
# 设置生产数据库环境变量
DATABASE_PROVIDER=postgresql
DATABASE_URL="your-postgresql-url"

# 运行数据库迁移
bunx prisma db push

# 添加初始数据（可选）
bun tsx prisma/seed.ts
\`\`\`

## 🔧 部署后验证

- [ ] 网站正常访问
- [ ] 用户注册登录正常
- [ ] OAuth登录功能正常
- [ ] AI生成功能正常
- [ ] 支付流程正常
- [ ] 邮件通知正常

## 📊 监控和维护

建议设置：
- Vercel Analytics
- Sentry错误追踪
- 数据库监控
- API使用量监控

---

部署时间：${new Date().toISOString()}
`;

  const guidePath = path.join(__dirname, '..', 'DEPLOYMENT_GUIDE.md');
  fs.writeFileSync(guidePath, guide);
  console.log(`✅ 部署指南已生成: ${guidePath}`);
}

async function main() {
  console.log(`
🚀 梦境之书 - 生产部署准备工具
=====================================

本工具将帮助您：
1. 检查环境变量配置
2. 运行代码质量检查
3. 生成部署指南
4. 确保生产就绪
`);

  try {
    // 检查环境变量
    const envCheck = await checkEnvironmentVariables();

    if (!envCheck) {
      console.log('\n⚠️  请先配置必需的环境变量后再继续部署');
      console.log('💡 参考 PRODUCTION_SETUP.md 了解详细配置步骤');

      const proceed = await question('\n是否继续生成部署指南？(y/n): ');
      if (proceed.toLowerCase() !== 'y') {
        process.exit(1);
      }
    }

    // 检查OAuth配置
    console.log('\n🔐 检查OAuth配置...');
    try {
      await runCommand('cd ' + path.join(__dirname, '..') + ' && node scripts/verify-oauth.js');
    } catch (error) {
      console.log('⚠️  OAuth配置检查遇到问题');
    }

    // 检查邮件服务
    console.log('\n✉️ 检查邮件服务...');
    const hasEmail = process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes('your-');
    if (hasEmail) {
      console.log('✅ 邮件服务已配置');
    } else {
      console.log('⚠️  邮件服务未配置（可选功能）');
    }

    // 运行测试
    const testsPassed = await runTests();

    if (!testsPassed) {
      console.log('\n⚠️  代码检查未通过，建议修复问题后再部署');

      const proceed = await question('\n是否继续？(y/n): ');
      if (proceed.toLowerCase() !== 'y') {
        process.exit(1);
      }
    }

    // 生成部署指南
    await generateDeploymentGuide();

    console.log(`
🎉 生产部署准备完成！
====================

✅ 环境变量: ${envCheck ? '已配置' : '需要配置'}
✅ 代码质量: ${testsPassed ? '通过' : '有问题'}
✅ 部署指南: 已生成

📝 下一步：
1. 查看 DEPLOYMENT_GUIDE.md
2. 推送代码到GitHub
3. 在Vercel导入项目
4. 配置环境变量
5. 部署！

🌐 需要帮助？查看 PRODUCTION_SETUP.md
`);

  } catch (error) {
    console.error(`\n❌ 部署准备失败: ${error.message}`);
  } finally {
    rl.close();
  }
}

// 运行主函数
if (require.main === module) {
  main();
}
